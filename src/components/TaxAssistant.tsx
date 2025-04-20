import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Brain, History, Trash2, AlertCircle, LogOut, X, Plus, Home, MessageSquare } from 'lucide-react';
import OpenAI from 'openai';
import Auth from './Auth';
import { Link } from 'react-router-dom';

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

const convertToTable = (text: string): string => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return text;

  const headers = lines[0].split('|').map(h => h.trim());
  const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()));

  let html = `
    <div class="overflow-x-auto my-4">
      <table class="min-w-full divide-y divide-gray-200 rounded-xl shadow overflow-hidden border border-gray-200">
        <thead class="bg-blue-50">
          <tr>
  `;

  headers.forEach(header => {
    html += `<th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">${header}</th>`;
  });

  html += `</tr></thead><tbody class="bg-white divide-y divide-gray-100">`;

  rows.forEach((row, index) => {
    html += `<tr class="hover:bg-gray-100 transition">`;
    row.forEach(cell => {
      html += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table></div>`;
  return html;
};

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
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
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
    text = text.replace(
      /^(Overview|Summary|Details|Important Points|Note|References):/gm,
      '### $1\n'
    );
    text = text.replace(/^[•●○]/gm, '- ');
    
    if (text.includes('|')) {
      const blocks = text.split('\n\n');
      const formattedBlocks = blocks.map(block => {
        if (block.includes('|')) {
          return convertToTable(block);
        }
        return block;
      });
      text = formattedBlocks.join('\n\n');
    }
    
    return text;
  };

  const createNewChat = async () => {
    setCurrentChatId(null);
    setMessages([]);
    setError(null);
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
        if (currentChatId) {
          const { error: updateError } = await supabase
            .from('chat_histories')
            .update({
              messages: updatedMessages,
            })
            .eq('id', currentChatId);
            
          if (updateError) throw updateError;
        } else {
          const { data: newChat, error: insertError } = await supabase
            .from('chat_histories')
            .insert([{
              messages: updatedMessages,
              title: input.slice(0, 50) + '...',
              user_id: user.id
            }])
            .select()
            .single();
            
          if (insertError) throw insertError;
          if (newChat) setCurrentChatId(newChat.id);
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
    setCurrentChatId(chat.id);
    setShowHistory(false);
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('chat_histories')
        .delete()
        .eq('id', chatId);
        
      if (error) throw error;
      
      setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError('Failed to delete chat. Please try again later.');
    }
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
      setCurrentChatId(null);
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
    setCurrentChatId(null);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className={`w-80 bg-gray-50 border-r border-gray-200 flex-shrink-0 transform transition-transform duration-300 ${
        showHistory ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 absolute md:relative z-30 h-full`}>
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Chat History</h2>
            <button
              onClick={() => setShowHistory(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            <Link
              to="/"
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-4 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Home
            </Link>
            <button
              onClick={createNewChat}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            <div className="space-y-2">
              {chatHistories.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChat(chat)}
                  className={`group relative bg-white hover:bg-gray-50 p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                    currentChatId === chat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <MessageSquare size={20} className={`${currentChatId === chat.id ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-gray-700 line-clamp-2 mb-1">
                        {chat.title}
                      </p>
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(chat.created_at).toLocaleDateString()} · {chat.messages.length} messages
                      </p>
                      {chat.messages.length > 0 && (
                        <p className="text-xs text-gray-600 line-clamp-2 group-hover:text-gray-900">
                          {chat.messages[chat.messages.length - 1].content}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen bg-gray-50">
        {/* Fixed Header */}
        <div className="bg-white border-b border-gray-200 p-4 fixed top-0 right-0 left-80 z-20">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <Brain className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Tax Assistant AI</h1>
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
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors group relative"
                title="Clear all chats"
              >
                <Trash2 size={20} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Clear all chats
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors group relative"
                title="Sign out"
              >
                <LogOut size={20} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  Sign out
                </span>
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 max-w-6xl mx-auto">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Scrollable Messages Area */}
        <div className="flex-1 overflow-y-auto pt-24 pb-24 px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <Brain size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Start a new conversation</p>
                <p className="text-sm">Ask me anything about Indian GST and Income Tax</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div
                  className={`w-full max-w-4xl rounded-xl p-6 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-4'
                      : 'bg-white border border-gray-100 mr-4'
                  }`}
                >
                  <div
                    className={`prose ${message.role === 'user' ? 'prose-invert' : ''} max-w-none`}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mr-4">
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="border-t border-gray-200 p-4 fixed bottom-0 right-0 left-80 bg-white">
          <div className="max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about GST, Income Tax, or any related queries..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400"
                disabled={isLoading || !supabase || (!OPENAI_API_KEY && !GEMINI_API_KEY)}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || !supabase || (!OPENAI_API_KEY && !GEMINI_API_KEY)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-6 py-3 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxAssistant;