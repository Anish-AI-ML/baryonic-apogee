import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Chatbot.css';

const AI_RESPONSES = [
  { keywords: ['price', 'pricing', 'cost', 'money'], text: 'Our pricing is tailored to your specific needs. Typically, projects start at $5k for robust e-commerce and scaling platforms. Want a detailed quote? Use our contact form!' },
  { keywords: ['services', 'offer', 'do'], text: 'We offer full-stack development, modern websites, e-commerce platforms, billing systems, frontend solutions, and digital portfolios.' },
  { keywords: ['contact', 'email', 'reach'], text: 'You can reach us at anvetechnologies@gmail.com, or fill out the contact form below!' },
  { keywords: ['hello', 'hi', 'hey'], text: 'Hello! I am Anve tech AI. How can I help you build the future today?' },
  { keywords: ['maintenance', 'support'], text: 'We provide 1 week of free technical maintenance for all our projects after launch to ensure a smooth transition.' },
  { keywords: ['ai', 'artificial intelligence'], text: 'Yes, we integrate cutting-edge AI features, just like me, into your digital platforms to automate workflows and enhance UX!' }
];

const getAIResponse = (userText) => {
  const lowerText = userText.toLowerCase();
  
  for (const response of AI_RESPONSES) {
    if (response.keywords.some(kw => lowerText.includes(kw))) {
      return response.text;
    }
  }
  
  return "That sounds incredibly interesting. Our engineers can definitely help you with that! Feel free to leave your contact details in the form so our team can reach out.";
};

const Chatbot = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
  }, [messages, isOpen]);

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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { role: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI typing delay
    setTimeout(() => {
      const aiReply = { role: 'ai', text: getAIResponse(userMsg.text) };
      setMessages(prev => [...prev, aiReply]);
    }, 800 + Math.random() * 600);
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
