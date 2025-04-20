import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import { Send, Loader2, Brain, Trash2, AlertCircle, LogOut, X, Plus, Home, MessageSquare, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import OpenAI from 'openai';
import Auth from './Auth';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  name?: string;
  isTyping?: boolean;
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

const formatResponse = (text: string) => {
  // Convert headings: **Heading** becomes <h3>
  text = text.replace(/\*\*(.*?)\*\*/g, '<h3 class="text-xl font-bold text-gray-800 mt-4 mb-2">$1</h3>');

  // Safe italic formatting: *italic* only when surrounded by space or punctuation
  text = text.replace(/(^|\s)\*(\S[^*]*\S)\*(?=\s|\.|,|$)/g, '$1<em class="text-gray-600 italic">$2</em>');

  // Highlight Important/Key Notes
  text = text.replace(
    /(Important Points|Key Points|Note):/g,
    '<div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4 rounded-r-lg"><h4 class="font-bold text-blue-800 mb-2">$1:</h4>'
  );

  // Section headers like Overview:, Details:, etc.
  text = text.replace(
    /^(Overview|Summary|Details|References):/gm,
    '<h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h3>'
  );

  // Bullet list formatting
  if (text.match(/^[\*\-•●○]\s+/m)) {
    const lines = text.split('\n');
    let insideList = false;
    let formattedText = '';

    for (let line of lines) {
      if (/^[\*\-•●○]\s+/.test(line)) {
        if (!insideList) {
          insideList = true;
          formattedText += '\n<ul class="list-disc pl-6 my-4 space-y-2 text-gray-700">\n';
        }
        formattedText += `<li class="mb-2">${line.replace(/^[\*\-•●○]\s+/, '')}</li>\n`;
      } else {
        if (insideList) {
          insideList = false;
          formattedText += '</ul>\n';
        }
        formattedText += line + '\n';
      }
    }

    if (insideList) formattedText += '</ul>\n';
    text = formattedText;
  }

  // Table formatting using markdown-style |
  if (text.includes('|')) {
    const blocks = text.split('\n\n');
    const formattedBlocks = blocks.map(block => {
      if (block.includes('|')) {
        const lines = block.trim().split('\n');
        if (lines.length < 2) return block;

        const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
        const rows = lines.slice(2).map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));

        let tableHtml = `
          <div class="overflow-x-auto my-6">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
              <thead>
                <tr class="bg-gradient-to-r from-blue-50 to-indigo-50">
                  ${headers.map(header => `
                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">${header}</th>
                  `).join('')}
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                ${rows.map((row, i) => `
                  <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150">
                    ${row.map(cell => `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-100">${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        return tableHtml;
      }
      return block;
    });

    text = formattedBlocks.join('\n\n');
  }

  // Code block formatting using ```
  text = text.replace(
    /```([^`]+)```/g,
    '<pre class="bg-gray-800 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto"><code>$1</code></pre>'
  );

  // Paragraph formatting
  text = text.replace(/\n\n/g, '</div>\n\n<div class="mb-4">');
  text = '<div class="mb-4">' + text + '</div>';

  // Cleanup: remove stray "*" used incorrectly
  text = text.replace(/(^|\s)\*(?=\s|$)/g, '');

  return text;
};

const getFinaccoResponse = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Company overview
  if (lowerQuery.includes('about finacco') || lowerQuery.includes('company information') || lowerQuery.includes('finacco solutions')) {
    return `
**About Finacco Solutions**

Finacco Solutions is a comprehensive financial and technology services provider offering:

* Financial Services:
  - GST Registration and Returns
  - Income Tax Filing
  - Business Consultancy
  - Company & LLP Services
  - TDS/TCS Services
  - Bookkeeping Services

* Technology Solutions:
  - Tally Prime Solutions
  - Data Import Tools
  - Financial Statement Preparation
  - Bank Reconciliation Tools
  - Custom Software Development
  - Web Development Services

**Contact Information:**
* Phone: +91 8590000761
* Email: contact@finaccosolutions.com
* Location: Mecca Tower, 2nd Floor, Court Road, Near Sree Krishna Theatre, Manjeri, Kerala-676521

**Business Hours:**
* Monday - Saturday: 9:30 AM - 6:00 PM
* Sunday: Closed

Visit our service platforms:
* [Finacco Advisory](https://advisory.finaccosolutions.com) - For all financial advisory services
* [Finacco Connect](https://connect.finaccosolutions.com) - For business utility software and Tally solutions
`;
  }

  // Contact information
  if (lowerQuery.includes('contact') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('address')) {
    return `
**Contact Information for Finacco Solutions:**

* Phone: +91 8590000761
* Email: contact@finaccosolutions.com
* Address: Mecca Tower, 2nd Floor, Court Road, Near Sree Krishna Theatre, Manjeri, Kerala-676521

**Office Hours:**
* Monday - Saturday: 9:30 AM - 6:00 PM
* Sunday: Closed

Feel free to reach out to us through WhatsApp or email for quick responses.
`;
  }

  // Finacco Connect services
  if (lowerQuery.includes('tally') || lowerQuery.includes('import') || lowerQuery.includes('connect') || lowerQuery.includes('utility software')) {
    return `
**Finacco Connect Services:**

Visit [Finacco Connect](https://connect.finaccosolutions.com) for:
* Tally Prime Solutions
  - Sales and Implementation
  - Training and Support
  - Customization Services
* Data Import Tools
  - Bank Statement Import
  - Tally Data Migration
  - Excel to Tally Integration
* Financial Statement Preparation
* Bank Reconciliation Tools
* Business Utility Software

For detailed information or support:
* Phone: +91 8590000761
* Email: contact@finaccosolutions.com
`;
  }

  // Finacco Advisory services
  if (lowerQuery.includes('advisory') || lowerQuery.includes('financial services')) {
    return `
**Finacco Advisory Services:**

Visit [Finacco Advisory](https://advisory.finaccosolutions.com) for:

* GST Services:
  - Registration
  - Monthly/Quarterly Returns
  - Annual Returns
  - GST Audit Support
  - E-way Bill Services

* Income Tax Services:
  - Individual Tax Filing
  - Business Tax Returns
  - Tax Planning
  - TDS Returns
  - Form 16/16A Generation

* Business Services:
  - Company Registration
  - LLP Formation
  - Business Consultancy
  - Bookkeeping Services
  - Financial Advisory

Contact us for professional assistance:
* Phone: +91 8590000761
* Email: contact@finaccosolutions.com
`;
  }

  return null;
};

const TaxAssistant: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [isHistoryHovered, setIsHistoryHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useGemini, setUseGemini] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState<Message | null>(null);
  const [textareaHeight, setTextareaHeight] = useState('56px');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestTimestamps = useRef<number[]>([]);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    if (!input) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = '56px';
      }
    }
  }, [input]);

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

  const createNewChat = async () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTypingMessage(null);
    setCurrentChatId(null);
    setMessages([]);
    setError(null);
  };

  const loadChat = (chat: ChatHistory) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTypingMessage(null);
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowHistory(false);
  };

  const saveToHistory = async (messages: Message[], input: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (currentChatId) {
        await supabase
          .from('chat_histories')
          .update({
            messages: messages,
          })
          .eq('id', currentChatId);
      } else {
        const { data: newChat } = await supabase
          .from('chat_histories')
          .insert([{
            messages: messages,
            title: input.length > 100 ? input.slice(0, 100) + '...' : input,
            user_id: user.id
          }])
          .select()
          .single();
          
        if (newChat) setCurrentChatId(newChat.id);
      }
      
      loadChatHistory(user.id);
    }
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
    const userName = user?.email?.split('@')[0] || 'User';
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      name: userName
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    const typingIndicator: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      name: 'Finacco Solutions',
      isTyping: true
    };
    setTypingMessage(typingIndicator);

    try {
      const finaccoResponse = getFinaccoResponse(input);
      
      if (finaccoResponse) {
        let displayedContent = '';
        const words = finaccoResponse.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          displayedContent += words[i] + ' ';
          setTypingMessage(prev => ({
            ...prev!,
            content: formatResponse(displayedContent)
          }));
        }

        const assistantResponse: Message = {
          id: typingIndicator.id,
          role: 'assistant',
          content: formatResponse(finaccoResponse),
          timestamp: new Date().toISOString(),
          name: 'Finacco Solutions'
        };
        
        setTypingMessage(null);
        const updatedMessages = [...messages, newMessage, assistantResponse];
        setMessages(updatedMessages);
        
        await saveToHistory(updatedMessages, input);
        return;
      }

      if (useGemini) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a helpful and knowledgeable tax assistant in India. Reply to the following query with clear, concise, and accurate information focused only on the user's question. 
                      Avoid introductions or general explanations unless directly related. 
                      Use bullet points, tables, and section headings if helpful for clarity. 
                      Keep the language simple and easy to understand, especially for non-experts.
                      
                      User's query: ${input}`
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

        let displayedContent = '';
        const words = data.candidates[0].content.parts[0].text.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          displayedContent += words[i] + ' ';
          setTypingMessage(prev => ({
            ...prev!,
            content: formatResponse(displayedContent)
          }));
        }

        const text = formatResponse(data.candidates[0].content.parts[0].text);
        
        const assistantResponse: Message = {
          id: typingIndicator.id,
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
          name: 'Finacco Solutions'
        };

        setTypingMessage(null);
        const updatedMessages = [...messages, newMessage, assistantResponse];
        setMessages(updatedMessages);
        await saveToHistory(updatedMessages, input);
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

        let displayedContent = '';
        const words = completion.choices[0].message.content.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          displayedContent += words[i] + ' ';
          setTypingMessage(prev => ({
            ...prev!,
            content: formatResponse(displayedContent)
          }));
        }

        const text = formatResponse(completion.choices[0].message.content);
        
        const assistantResponse: Message = {
          id: typingIndicator.id,
          role: 'assistant',
          content: text,
          timestamp: new Date().toISOString(),
          name: 'Finacco Solutions'
        };

        setTypingMessage(null);
        const updatedMessages = [...messages, newMessage, assistantResponse];
        setMessages(updatedMessages);
        await saveToHistory(updatedMessages, input);
      }
    } catch (error) {
      console.error('Error:', error);
      setTypingMessage(null);
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
        name: 'Finacco Solutions'
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

  const handleHistoryMouseEnter = () => {
    setIsHistoryHovered(true);
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }
  };

  const handleHistoryMouseLeave = () => {
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }
    historyTimeoutRef.current = setTimeout(() => {
      setIsHistoryHovered(false);
    }, 300);
  };

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* History Panel */}
      <div 
        className={`fixed md:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-40 ${
          showHistory ? 'translate-x-0' : '-translate-x-[280px]'
        }`}
      >
        {/* Main History Panel */}
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col h-full">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-semibold">Chat History</h2>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
          
          <div className="flex gap-2 px-4 py-2">
            <button
              onClick={() => {
                createNewChat();
                setShowHistory(false);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
            >
              <Plus size={18} />
              <span>New Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-2">
            {chatHistories.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat)}
                className={`group relative bg-white hover:bg-gray-50 p-4 rounded-lg cursor-pointer transition-all duration-300 border mb-2 hover:shadow-md ${
                  currentChatId === chat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare size={20} className={`${currentChatId === chat.id ? 'text-blue-500' : 'text-gray-400'} group-hover:scale-110 transition-transform`} />
                  <div className="flex-grow min-w-0 pr-8">
                    <p className="text-sm font-medium text-gray-700 line-clamp-4 group-hover:text-blue-600 transition-colors">{chat.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </p>
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

      {/* Collapsed History Panel */}
      {!showHistory && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 transform z-40">
          <button
            onClick={() => setShowHistory(true)}
            className="bg-white border border-gray-200 rounded-r-lg shadow-md p-2 hover:bg-gray-50 transition-colors"
          >
            <PanelLeftOpen size={20} />
          </button>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${
        showHistory ? 'md:ml-[280px]' : 'ml-0'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-md">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Tax Assistant AI</h1>
                <p className="text-sm text-white/80">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Home size={20} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <button
                onClick={clearChat}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Clear all chats"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                title="Sign out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-3">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Brain className="text-white" size={18} />
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto'
                      : 'bg-white shadow-sm border border-gray-100 mr-auto'
                  } max-w-[85%]`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {message.name || (message.role === 'user' ? 'You' : 'Assistant')}
                    </span>
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div
                    className={message.role === 'assistant' ? 'prose max-w-none' : ''}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {message.name?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            ))}
            
            {typingMessage && (
              <div className="flex items-start gap-3 justify-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                  <Brain className="text-white" size={18} />
                </div>
                <div className="rounded-lg p-4 bg-white shadow-sm border border-gray-100 mr-auto max-w-[85%]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{typingMessage.name}</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                  {typingMessage.content && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: typingMessage.content }}
                    />
                  )}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto flex items-start gap-4">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustTextareaHeight();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim() && !isLoading) {
                      handleSubmit(e);
                    }
                  }
                }}
                placeholder="Ask me about taxes... (Press Enter to send, Shift + Enter for new line)"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                style={{ minHeight: '56px', maxHeight: '200px' }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 ${
                isLoading || !input.trim()
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxAssistant;