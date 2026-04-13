import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';
import { apiRequest } from '@/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Welcome to WePollin! How can I help you today?', sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      // Send to backend
      const response = await apiRequest("POST",'chat/query', {
        query: inputValue
      }, {
        withCredentials: true  // Important for sending cookies if using sessions
      });

      // Add bot response
      const botMessage = { text: response.data.answer, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        text: `Error: ${error.response?.data?.message || error.message || 'Unknown error occurred'}`, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div 
          className="w-80 h-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden"
          style={{ background: '#fff', border: '1px solid #e7e5e4', fontFamily: "'DM Sans', sans-serif" }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
          `}</style>
          {/* Header */}
          <div 
            className="text-white p-4 flex justify-between items-center"
            style={{ background: '#1c1917' }}
          >
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" style={{ color: '#fbbf24' }} />
              <span className="font-semibold syne" style={{ fontFamily: "'Syne', sans-serif" }}>WePollin Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto" style={{ background: '#fafaf9' }}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className="max-w-[80%] p-3 rounded-lg"
                    style={{
                      background: message.sender === 'user' ? '#1c1917' : '#fff',
                      color: message.sender === 'user' ? '#fff' : '#1c1917',
                      border: message.sender === 'user' ? 'none' : '1px solid #e7e5e4',
                      borderRadius: message.sender === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'
                    }}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />}
                      <p className="text-sm">{message.text}</p>
                      {message.sender === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#fbbf24' }} />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white" style={{ borderColor: '#e7e5e4' }}>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 text-sm rounded-full focus:outline-none"
                style={{ 
                  border: '1px solid #e7e5e4',
                  fontFamily: "'DM Sans', sans-serif"
                }}
              />
              <button 
                type="submit"
                className="p-2 rounded-full transition-all duration-200 hover:opacity-90"
                style={{ background: '#1c1917', color: '#fff' }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
          style={{ background: '#1c1917', color: '#fbbf24' }}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
