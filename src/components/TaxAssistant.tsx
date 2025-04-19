import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Brain, History, Trash2, AlertCircle } from 'lucide-react';
import OpenAI from 'openai';

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
  timestamp: string;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 3;

const TaxAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestTimestamps = useRef<number[]>([]);
  
  const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('Supabase configuration is missing. Please check your environment variables.');
      return;
    }
    if (!OPENAI_API_KEY) {
      setError('OpenAI API key is missing. Please check your environment variables.');
      return;
    }
    scrollToBottom();
    loadChatHistory();
  }, [messages]);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    // Remove timestamps older than the window
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (!supabase) {
      setError('Cannot save chat history: Supabase is not properly configured.');
      return;
    }
    if (!OPENAI_API_KEY) {
      setError('OpenAI API key is missing. Please check your environment variables.');
      return;
    }

    if (!checkRateLimit()) {
      return;
    }

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
      const systemPrompt = `You are a knowledgeable tax assistant specializing in Indian GST and Income Tax. 
      Provide accurate, fact-based responses with examples where appropriate. 
      Format your responses using markdown for better readability.
      Always cite relevant sections of tax laws when applicable.
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

      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: completion.choices[0].message.content,
        timestamp: new Date().toISOString(),
      };

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
      }
        
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota exceeded')) {
          errorMessage = 'You have reached the API rate limit. Please try again in a few minutes.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I'm currently experiencing high demand. Please try again in a few minutes.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async () => {
    if (!supabase) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_histories')
        .select('*')
        .eq('user_id', user.id)
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

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex h-[calc(100vh-8rem)]">
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
                        <p className="text-xs text-gray-500">{new Date(chat.timestamp).toLocaleDateString()}</p>
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
                        <p className="text-sm text-gray-500">Ask me anything about GST and Income Tax</p>
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
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <ReactMarkdown className="prose prose-sm max-w-none">
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-4">
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
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoading || !supabase || !OPENAI_API_KEY}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !input.trim() || !supabase || !OPENAI_API_KEY}
                      className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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