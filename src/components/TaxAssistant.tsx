import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Brain, History, Trash2, AlertCircle, LogOut } from 'lucide-react';
import OpenAI from 'openai';
import Auth from './Auth';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  user_id: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    new URL(SUPABASE_URL);
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 3;

const TaxAssistant: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useGemini, setUseGemini] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestTimestamps = useRef<number[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!supabase) return;
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadChatHistory(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadChatHistory(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('Supabase configuration is missing. Please check your environment variables.');
      return;
    }
    if (!OPENAI_API_KEY && !GEMINI_API_KEY) {
      setError('API keys are missing. Please check your environment variables.');
      return;
    }
    scrollToBottom();
  }, [messages]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    requestTimestamps.current = requestTimestamps.current.filter(
      timestamp => now - timestamp < RATE_LIMIT_WINDOW
    );
    
    if (requestTimestamps.current.length >= MAX_REQUESTS_PER_WINDOW) {
      const oldestTimestamp = requestTimestamps.current[0];
      const timeUntilReset = RATE_LIMIT_WINDOW - (now - oldestTimestamp);
      const minutesUntilReset = Math.ceil(timeUntilReset / 60000);
      
      setError(`Rate limit exceeded. Please try again in ${minutesUntilReset} minute${minutesUntilReset > 1 ? 's' : ''}.`);
      return false;
    }
    
    requestTimestamps.current.push(now);
    return true;
  };

  const formatResponse = (text: string) => {
    // Add section headers
    text = text.replace(/^(Overview|Summary|Details|Important Points|Note|References):/gm, '### $1:');
    
    // Convert bullet points to proper markdown
    text = text.replace(/^[•●○]/gm, '-');
    
    // Add table formatting if there's tabular data
    if (text.includes('|')) {
      const lines = text.split('\n');
      const tableStart = lines.findIndex(line => line.includes('|'));
      if (tableStart !== -1) {
        lines.splice(tableStart + 1, 0, lines[tableStart].replace(/[^|]/g, '-'));
        text = lines.join('\n');
      }
    }
    
    return text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!supabase) {
      setError('Cannot save chat history: Supabase is not properly configured.');
      return;
    }

    if (!checkRateLimit()) return;

    setError(null);
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let assistantResponse: Message;

      if (useGemini) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a knowledgeable tax assistant specializing in Indian GST and Income Tax. 
                Format your response with clear sections, bullet points, and tables where appropriate.
                Please provide accurate, fact-based responses about the following query: ${input}`
              }]
            }]
          })
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Gemini API endpoint not found. Switching to OpenAI...');
          }
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error('Invalid response format from Gemini API');
        }

        const text = formatResponse(data.candidates[0].content.parts[0].text);

        assistantResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
        };
      } else {
        const systemPrompt = `You are a knowledgeable tax assistant specializing in Indian GST and Income Tax. 
        Format your responses with:
        - Clear section headers (Overview, Details, Important Points)
        - Bullet points for key information
        - Tables for comparative data
        - Examples where appropriate
        Always cite relevant sections of tax laws.
        If you're not completely sure about something, say so and recommend consulting a tax professional.`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(msg => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content
            })),
            { role: "user", content: input }
          ]
        });

        if (!completion.choices[0]?.message?.content) {
          throw new Error('No response received from OpenAI');
        }

        const text = formatResponse(completion.choices[0].message.content);

        assistantResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
        };
      }

      const updatedMessages = [...messages, newMessage, assistantResponse];
      setMessages(updatedMessages);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: supabaseError } = await supabase
          .from('chat_histories')
          .insert([{
            messages: updatedMessages,
            title: input.slice(0, 50) + '...',
            user_id: user.id
          }]);
          
        if (supabaseError) {
          throw new Error(`Failed to save chat history: ${supabaseError.message}`);
        }
        
        loadChatHistory(user.id);
      }
        
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          setUseGemini(false);
          errorMessage = 'Gemini API is not available. Switched to OpenAI. Please try your question again.';
        } else if (error.message.includes('429') || error.message.includes('quota exceeded')) {
          errorMessage = 'You have reached the API rate limit. Please try again in a few minutes.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm currently experiencing technical difficulties. Please try again in a few minutes.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async (userId: string) => {
    if (!supabase) return;
    
    try {
      const { data, error } = await supabase
        .from('chat_histories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setChatHistories(data);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history. Please try again later.');
    }
  };

  const loadChat = (chat: ChatHistory) => {
    setMessages(chat.messages);
    setShowHistory(false);
  };

  const clearChat = async () => {
    if (!supabase) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error: deleteError } = await supabase
        .from('chat_histories')
        .delete()
        .eq('user_id', user.id);
        
      if (deleteError) throw deleteError;

      setMessages([]);
      setChatHistories([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      setError('Failed to clear chat history. Please try again later.');
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessages([]);
    setChatHistories([]);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex h-[calc(100vh-2rem)]">
              {/* Sidebar */}
              <div className={`w-80 bg-gray-50 border-r border-gray-200 flex-shrink-0 ${showHistory ? '' : 'hidden'} md:block`}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">Chat History</h2>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="md:hidden text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2">
                    {chatHistories.map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => loadChat(chat)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-700 truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500">{new Date(chat.created_at).toLocaleDateString()}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                        <Brain className="text-white" size={24} />
                      </div>
                      <div>
                        <h1 className="text-xl font-bold text-gray-800">Tax Assistant AI</h1>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowHistory(true)}
                        className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <History size={20} />
                      </button>
                      <button
                        onClick={clearChat}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Clear chat"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Sign out"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-lg p-6 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <ReactMarkdown 
                          className={`prose ${message.role === 'user' ? 'prose-invert' : 'prose-blue'} max-w-none`}
                          components={{
                            h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="text-base" {...props} />,
                            table: ({node, ...props}) => (
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200" {...props} />
                              </div>
                            ),
                            th: ({node, ...props}) => <th className="px-4 py-2 bg-gray-50 font-semibold" {...props} />,
                            td: ({node, ...props}) => <td className="px-4 py-2 border-t" {...props} />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-6">
                        <Loader2 className="animate-spin" size={24} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSubmit} className="flex space-x-4">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about GST, Income Tax, or any related queries..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading || !supabase || (!OPENAI_API_KEY && !GEMINI_API_KEY)}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim() || !supabase || (!OPENAI_API_KEY && !GEMINI_API_KEY)}
                      className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistant;