import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const WorksContext = createContext();

export const WorksProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('anve_tech_projects');
    if (saved) return JSON.parse(saved);
    return translations.en.projects.items.map((item, idx) => ({
      ...item,
      id: idx + 1,
      status: 'Completed',
      shareLink: '',
      files: [],
      image: ["/images/ecommerce_ai.png", "/images/modern_website.png", "/images/billing.png", "/images/frontend_dashboard.png", "/images/portfolio_sharp.png"][idx] || "/images/modern_website.png",
      tech: ["React, Next.js, Stripe, OpenAI", "Next.js, Framer Motion, Tailwind", "Node.js, PostgreSQL, Stripe", "React, Redux, Graphics Engine", "Three.js, WebGL, GSAP"][idx] || "React, Vite"
    }));
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('anve_tech_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [visitorCount, setVisitorCount] = useState(() => {
    const saved = localStorage.getItem('anve_tech_visitors');
    return saved ? parseInt(saved) : 0;
  });

  // Persist changes
  useEffect(() => {
    localStorage.setItem('anve_tech_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('anve_tech_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('anve_tech_visitors', visitorCount.toString());
  }, [visitorCount]);

  // Sync across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'anve_tech_messages' && e.newValue) {
        setMessages(JSON.parse(e.newValue));
      }
      if (e.key === 'anve_tech_projects' && e.newValue) {
        setProjects(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addProject = (project) => {
    setProjects(prev => [{ 
      ...project, 
      id: Date.now(), 
      clientId: project.clientId || '',
      status: project.status || 'Planning',
      shareLink: project.shareLink || '',
      files: project.files || [] 
    }, ...prev]);
  };

  const updateProject = (id, updatedData) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const addMessage = (message, userEmail = '', sender = 'user') => {
    setMessages(prev => [{ 
      ...message, 
      id: Date.now(), 
      userEmail, 
      sender, 
      read: false, // All new messages are unread for the recipient
      createdAt: new Date().toISOString() 
    }, ...prev]);
  };

  const markMessagesAsRead = (userEmail, recipientType = 'admin') => {
    setMessages(prev => prev.map(m => {
      const isTargetConvo = (m.userEmail === userEmail || m.email === userEmail);
      const isNewMessageForRecipient = (recipientType === 'admin' ? m.sender === 'user' : m.sender === 'admin');
      
      if (isTargetConvo && isNewMessageForRecipient) {
        return { ...m, read: true };
      }
      return m;
    }));
  };

  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const incrementVisitors = () => {
    setVisitorCount(prev => prev + 1);
  };

  return (
    <WorksContext.Provider value={{ 
      projects, addProject, updateProject, deleteProject,
      messages, addMessage, markMessagesAsRead, deleteMessage,
      visitorCount, incrementVisitors 
    }}>
      {children}
    </WorksContext.Provider>
  );
};

export const useWorks = () => {
  const context = useContext(WorksContext);
  if (!context) throw new Error('useWorks must be used within a WorksProvider');
  return context;
};
