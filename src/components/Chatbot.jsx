import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './Chatbot.css';

const SYSTEM_PROMPT = `You are the Elite AI Sales Representative for Anve Tech, a premium modern digital solutions and web development studio. 
Your goal is to beautifully and concisely assist clients, answer questions about web services, build high-end rapport, and guide them to use our contact form or email anvetechnologies@gmail.com for accurate project quotes. 
Keep your responses professional, friendly, and fairly short (1-3 sentences when possible). Our core services include Custom Websites, full-stack eCommerce platforms, internal Billing Systems, modern Frontend solutions, and Digital Portfolios. Do not hallucinate physical locations or fake phone numbers. Ensure you highlight Anve Tech's premium quality, scalable architecture, and dedication to digital craftsmanship.`;

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing AI API Key. Please configure your .env file.");
      }

      // Format messages strictly for Gemini API (user / model)
      // We skip the very first welcome message if it's just 'Hello' to save tokens, but keeping it is fine.
      const apiContents = conversation.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: apiContents,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
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
