import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatbotService } from '@/services/chatbot.service';
import { useLanguage } from '@/context/LanguageContext';
import './PatientChatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  action?: {
    type: 'book_appointment';
    data: any;
  };
}

const PatientChatbot = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'ar' 
        ? 'مرحباً! أنا مساعدك الطبي. كيف يمكنني مساعدتك اليوم؟ يمكنك حجز موعد أو طرح أي سؤال طبي.'
        : 'Hello! I\'m your medical assistant. How can I help you today? You can book an appointment or ask any medical question.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatbotService.sendMessage(input.trim());
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        action: response.action
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle appointment booking action
      if (response.action?.type === 'book_appointment' && response.action.data) {
        const actionData = response.action.data;
        // Navigate to booking page with pre-filled data
        setTimeout(() => {
          navigate('/patient/book-appointment', {
            state: {
              doctor_id: actionData.doctor_id,
              appointment_date: actionData.appointment_date,
              appointment_time: actionData.appointment_time,
              reason: actionData.reason
            }
          });
          setIsOpen(false);
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'ar' 
          ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
          : 'Sorry, an error occurred. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open chatbot"
        title={language === 'ar' ? 'افتح المساعد الطبي' : 'Open Medical Assistant'}
      >
        <span className="chatbot-icon" style={{ fontSize: '1.5rem' }}>💬</span>
      </button>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <span className="chatbot-icon-header">🤖</span>
          <div>
            <h3>{language === 'ar' ? 'المساعد الطبي' : 'Medical Assistant'}</h3>
            <p className="chatbot-subtitle">
              {language === 'ar' ? 'متاح 24/7' : 'Available 24/7'}
            </p>
          </div>
        </div>
        <button
          className="chatbot-close"
          onClick={() => setIsOpen(false)}
          aria-label="Close chatbot"
        >
          ✕
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chatbot-message ${message.sender}`}
          >
            <div className="message-content">
              {message.text}
              {message.action && (
                <div className="message-action">
                  {language === 'ar' ? 'جاري الانتقال...' : 'Redirecting...'}
                </div>
              )}
            </div>
            <span className="message-time">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {loading && (
          <div className="chatbot-message bot">
            <div className="message-content">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
          className="chatbot-input"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="chatbot-send"
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default PatientChatbot;

