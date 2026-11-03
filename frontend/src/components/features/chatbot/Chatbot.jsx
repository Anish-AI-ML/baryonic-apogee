import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import './Chatbot.css';

const Chatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: t('chatbot.welcome') }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  useEffect(() => {
    // Reset initial message when language changes
    setMessages([{ role: 'ai', text: t('chatbot.welcome') }]);
  }, [t]);

  useEffect(() => {
    let timer;
    if (!isOpen) {
      timer = setTimeout(() => {
        setShowTooltip(true);
      }, 5000);
    } else {
      setShowTooltip(false);
    }
    
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue.trim();
    const newUserMsg = { role: 'user', text: userText };
    const conversation = [...messages, newUserMsg];
    
    setMessages(conversation);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation.map(({ role, text }) => ({ role, text })) })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.text;
      
      if (aiText) {
        setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (err) {
      console.error("Chatbot AI Error:", err);
      // Fallback response if API fails
      setMessages(prev => [...prev, { role: 'ai', text: "I'm currently experiencing high network traffic. Please reach out to our team directly via the contact form below!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-header-icon">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3>{t('chatbot.header')}</h3>
                  <div className="chatbot-status">
                    <span className="status-dot"></span> {t('chatbot.online')}
                  </div>
                </div>
              </div>
              <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message message-${msg.role}`}>
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message message-ai typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chatbot-input-container">
              <input 
                type="text" 
                className="chatbot-input" 
                placeholder={t('chatbot.placeholder')} 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
              />
              <button 
                className="chatbot-send-btn" 
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div 
            className="chatbot-tooltip"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
          >
            {t('chatbot.welcome')}
            <button className="tooltip-close" onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}>
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="chatbot-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        animate={isOpen ? { rotate: 90, opacity: 0 } : { rotate: 0, opacity: 1 }}
        style={{ position: isOpen ? 'absolute' : 'relative', bottom: isOpen ? -100 : 0, pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        <MessageSquare size={26} />
      </motion.button>
    </div>
  );
};

export default Chatbot;
