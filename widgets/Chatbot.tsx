import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Send, Loader, AlertCircle, ShieldCheck, ChevronDown } from 'lucide-react';
import { createChatSession, sendChatMessage } from '../services/chatApi';
import { createInquiry } from '../services/api';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

const Chatbot: React.FC = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isLogged, setIsLogged] = useState(true);
    const [showPrivacySettings, setShowPrivacySettings] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFallback, setShowFallback] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Initialize session on first open
    useEffect(() => {
        if (isOpen && !sessionId) {
            initializeSession();
        }
    }, [isOpen]);

    // Show welcome hint after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen && !sessionStorage.getItem('chatbot_hint_shown')) {
                setShowHint(true);
                sessionStorage.setItem('chatbot_hint_shown', 'true');
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const initializeSession = async () => {
        try {
            // Check if session exists in localStorage
            const storedSessionId = localStorage.getItem('kemu_chat_session');
            if (storedSessionId) {
                setSessionId(storedSessionId);
                // Add welcome message
                setMessages([{
                    role: 'assistant',
                    content: "Welcome back! I'm KeMU Assistant. How can I help you today?",
                    timestamp: new Date(),
                }]);
            } else {
                // Create new session
                const session = await createChatSession(undefined, undefined, isLogged);
                setSessionId(session.sessionId);
                localStorage.setItem('kemu_chat_session', session.sessionId);

                // Add welcome message
                setMessages([{
                    role: 'assistant',
                    content: "Hello! I'm KeMU Assistant, powered by AI. I can help you with information about programs, admissions, events, and more. How can I assist you today?",
                    timestamp: new Date(),
                }]);
            }
        } catch (err) {
            console.error('Failed to initialize session:', err);
            setError('Failed to start chat session. Please try again.');
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !sessionId || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: inputMessage.trim(),
            timestamp: new Date(),
        };

        // Add user message immediately
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setIsTyping(true);
        setError(null);

        try {
            const response = await sendChatMessage(sessionId, userMessage.content, isLogged);

            // Check if moderated
            if (response.isModerated) {
                setMessages(prev => [...prev, {
                    role: 'system',
                    content: response.reply,
                    timestamp: new Date(),
                }]);
            } else if (response.fallback) {
                // AI service error - show fallback option
                setShowFallback(true);
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: "I'm having trouble connecting to the AI service right now. Would you like to send a message to our admissions team instead?",
                    timestamp: new Date(),
                }]);
            } else {
                // Simulate typing delay
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: response.reply,
                        timestamp: new Date(),
                    }]);
                    setIsTyping(false);
                }, 500);
            }
        } catch (err: any) {
            console.error('Failed to send message:', err);
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
            setShowFallback(true);
            setIsTyping(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleFallbackInquiry = async () => {
        const inquiryMessage = messages
            .filter(m => m.role === 'user')
            .map(m => m.content)
            .join('\n\n');

        try {
            await createInquiry({
                name: 'Chat User',
                email: 'chat@inquiry.kemu',
                message: inquiryMessage || 'User requested help via chatbot',
                source: 'chatbot',
            });

            setMessages(prev => [...prev, {
                role: 'system',
                content: "✅ Your message has been sent to our team. We'll get back to you soon!",
                timestamp: new Date(),
            }]);
            setShowFallback(false);
        } catch (err) {
            setError('Failed to send inquiry. Please try our contact page.');
        }
    };

    const togglePrivacy = () => {
        setIsLogged(!isLogged);
        localStorage.setItem('kemu_chat_logged', (!isLogged).toString());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return (
            <>
                {/* Welcome Hint */}
                {showHint && (
                    <div
                        className="fixed bottom-24 right-6 bg-gradient-to-r from-kemu-purple to-kemu-blue text-white px-4 py-2 rounded-xl shadow-lg text-sm animate-fadeIn cursor-pointer z-40"
                        onClick={() => {
                            setIsOpen(true);
                            setShowHint(false);
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <MessageCircle size={16} />
                            <span>Need help? Ask me anything!</span>
                            <X
                                size={16}
                                className="ml-2 opacity-70 hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowHint(false);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Floating Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-kemu-gold to-kemu-gold/80 rounded-full shadow-[0_8px_20px_rgba(160,103,46,0.4)] hover:shadow-[0_12px_30px_rgba(160,103,46,0.6)] hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
                    aria-label="Open AI Chatbot"
                >
                    <MessageCircle className="text-white group-hover:scale-110 transition-transform" size={28} />
                </button>
            </>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] max-h-[calc(100vh-3rem)] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/20 flex flex-col z-50 animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue p-4 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="text-white" size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">KeMU Assistant</h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                            AI-Powered
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowPrivacySettings(!showPrivacySettings)}
                        className="text-white/80 hover:text-white transition-colors p-1"
                        title="Privacy Settings"
                    >
                        <ShieldCheck size={20} />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white/80 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Privacy Settings Dropdown */}
            {showPrivacySettings && (
                <div className="bg-purple-50 p-3 border-b border-purple-100">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">Save Conversation</p>
                            <p className="text-xs text-gray-600">Store messages for quality improvement</p>
                        </div>
                        <button
                            onClick={togglePrivacy}
                            className={`relative w-12 h-6 rounded-full transition-colors ${isLogged ? 'bg-kemu-purple' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isLogged ? 'translate-x-6' : 'translate-x-0'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-kemu-purple to-kemu-blue text-white'
                                    : msg.role === 'system'
                                        ? 'bg-kemu-gold/10 text-kemu-gold border border-kemu-gold/20'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Fallback to Inquiry */}
                {showFallback && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <p className="text-sm text-blue-800 mb-2">Having trouble? Send a message directly to our team:</p>
                        <button
                            onClick={handleFallbackInquiry}
                            className="w-full bg-gradient-to-r from-kemu-gold to-kemu-gold/90 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            Send as Inquiry
                        </button>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (show when no messages yet) */}
            {messages.length <= 1 && (
                <div className="p-4 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleQuickAction('/programs')}
                            className="text-xs px-3 py-2 bg-kemu-purple/10 hover:bg-kemu-purple/20 text-kemu-purple rounded-lg transition-colors border border-kemu-purple/20"
                        >
                            🎓 Programs
                        </button>
                        <button
                            onClick={() => handleQuickAction('/admissions')}
                            className="text-xs px-3 py-2 bg-kemu-blue/10 hover:bg-kemu-blue/20 text-kemu-blue rounded-lg transition-colors border border-kemu-blue/20"
                        >
                            ℹ️ Admissions
                        </button>
                        <button
                            onClick={() => handleQuickAction('/news')}
                            className="text-xs px-3 py-2 bg-kemu-gold/10 hover:bg-kemu-gold/20 text-kemu-gold rounded-lg transition-colors border border-kemu-gold/20"
                        >
                            📰 News
                        </button>
                        <button
                            onClick={() => handleQuickAction('/contact')}
                            className="text-xs px-3 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors border border-green-200"
                        >
                            💬 Contact
                        </button>
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
                <div className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about KeMU..."
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemu-purple focus:border-transparent resize-none disabled:opacity-50"
                        rows={1}
                        style={{ maxHeight: '100px' }}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-gradient-to-r from-kemu-gold to-kemu-gold/90 text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader className="animate-spin" size={20} /> : <Send size={20} />}
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {isLogged ? '🔒 Conversation saved for quality improvement' : '🕶️ Anonymous mode - not saved'}
                </p>
            </div>
        </div>
    );
};

export default Chatbot;
