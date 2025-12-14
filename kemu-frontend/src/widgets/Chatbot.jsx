import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import api from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm the KeMU assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send inquiry to backend
      await api.post('/inquiries', {
        name: 'Chatbot User',
        email: 'chatbot@kemu.ac.ke',
        message: input,
        source: 'chatbot'
      });

      // Simple bot response (in production, integrate with AI/ML)
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: getBotResponse(input),
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again or contact us directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      setIsTyping(false);
    }
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('program') || lowerInput.includes('course')) {
      return "We offer a wide range of programs including undergraduate, postgraduate, and certificate courses. Visit our Programs page to explore all available options!";
    }
    if (lowerInput.includes('admission') || lowerInput.includes('apply')) {
      return "You can apply online through our admissions portal. Visit the Admissions page for detailed information about requirements and the application process.";
    }
    if (lowerInput.includes('fee') || lowerInput.includes('cost') || lowerInput.includes('tuition')) {
      return "Tuition fees vary by program. Please visit our Admissions page or contact our finance office at info@kemu.ac.ke for detailed fee information.";
    }
    if (lowerInput.includes('campus') || lowerInput.includes('location')) {
      return "KeMU has three campuses: Main Campus in Meru, Nairobi Campus, and Mombasa Campus. All offer quality education with modern facilities.";
    }
    if (lowerInput.includes('scholarship') || lowerInput.includes('financial aid')) {
      return "Yes! KeMU offers the Bless to Bless Scholarship Program and other financial aid options. Check our Admissions page for details.";
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! Welcome to Kenya Methodist University. How can I assist you today?";
    }
    
    return "Thank you for your message! Our team will get back to you soon. For immediate assistance, please call +254 700 123 456 or email info@kemu.ac.ke";
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-kemu-purple to-kemu-blue text-white p-4 rounded-full shadow-deep-3d hover:shadow-glow-purple transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open chatbot"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-deep-3d border border-gray-200 flex flex-col z-50 animate-fade-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-kemu-purple to-kemu-blue text-white p-4 rounded-t-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold font-serif">KeMU Assistant</h3>
                <p className="text-xs text-purple-100">Ask me anything!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-kemu-gold transition-colors"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-kemu-purple-10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-kemu-blue text-white'
                      : 'bg-white text-gray-800 shadow-soft-3d'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot size={16} className="mt-1 text-kemu-purple flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User size={16} className="mt-1 text-white flex-shrink-0" />
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg p-3 shadow-soft-3d">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kemu-gold focus:border-kemu-gold"
              />
              <button
                type="submit"
                className="bg-kemu-gold text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;


