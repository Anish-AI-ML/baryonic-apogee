import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = ({ scrolled }) => {
  const { t } = useLanguage();
  const { currentUser, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'about', 'how-it-works', 'projects', 'why', 'contact'];
      let current = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'glass' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container nav-container">
        <a href="#" className="logo">
          <Logo className="navbar-logo" />
        </a>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="center-nav">
          <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>{t('nav.services')}</a>
          <a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}>{t('nav.about')}</a>
          <a href="#how-it-works" className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}>{t('nav.howItWorks')}</a>
          <a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}>{t('nav.projects')}</a>
          <a href="#why" className={`nav-link ${activeSection === 'why' ? 'active' : ''}`}>{t('nav.features')}</a>
          {(activeSection !== '' && activeSection !== 'home') && (
            <a 
              href="#contact" 
              className={`nav-link contact-nav-link ${activeSection === 'contact' ? 'active glow' : ''}`}
            >
              {t('nav.contact')}
            </a>
          )}
        </div>

        <div className="desktop-nav">
          <div className="auth-nav-group">
            {currentUser && (
               <a href="#dashboard" className={`nav-link dashboard-nav-pill ${activeSection === 'dashboard' ? 'active' : ''}`}>
                 Dashboard
               </a>
            )}
            {currentUser ? (
               <a href="#dashboard" className="user-profile-prominent">
                <span className="user-name-nav"><User size={16} /> {currentUser.name}</span>
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }} 
                  className="btn-logout-prominent"
                >
                  <LogOut size={18} />
                </button>
              </a>
            ) : (
              <a href="#login" className="btn btn-black login-btn-prominent">
                <LogIn size={18} /> Login / Signup
              </a>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-nav-content">
              {currentUser && (
                <a href="#dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-user-info">
                   <User size={24} color="#a855f7" />
                   <span>{currentUser.name}</span>
                </a>
              )}
              
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-nav-link ${activeSection === 'services' ? 'active' : ''}`}>{t('nav.services')}</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-nav-link ${activeSection === 'about' ? 'active' : ''}`}>{t('nav.about')}</a>
              <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}>{t('nav.howItWorks')}</a>
              <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-nav-link ${activeSection === 'projects' ? 'active' : ''}`}>{t('nav.projects')}</a>
              <a href="#why" onClick={() => setIsMobileMenuOpen(false)} className={`mobile-nav-link ${activeSection === 'why' ? 'active' : ''}`}>{t('nav.features')}</a>
              {(activeSection !== '' && activeSection !== 'home') && (
                <a 
                  href="#contact" 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className={`mobile-nav-link ${activeSection === 'contact' ? 'active glow' : ''}`}
                >
                  {t('nav.contact')}
                </a>
              )}
              
              <div className="mobile-auth-actions">
                {currentUser ? (
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mobile-nav-link logout-text">
                    <LogOut size={20} /> Logout
                  </button>
                ) : (
                  <a href="#login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-nav-link">
                    <LogIn size={20} /> Login / Signup
                  </a>
                )}
              </div>

              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="btn btn-black mobile-contact-btn">
                {t('nav.contact')}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
