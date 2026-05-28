import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LogIn, Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../common/Logo';
import './Navbar.css';

const Navbar = ({ scrolled }) => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') return;

      const sections = ['work', 'services', 'standards', 'process'];
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
  }, [location.pathname]);

  return (
    <motion.header 
      className={`command-bar-wrapper ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="command-bar-segmented" aria-label="Main Navigation">
        
        {/* Left: Brand Lockup */}
        <div className="command-pill brand-pill">
          <Link to="/" className="brand-logo-link" aria-label="Go to homepage">
            <Logo className="command-logo" />
          </Link>
          <div className="brand-divider" aria-hidden="true"></div>
          <span className="brand-descriptor">Web design & frontend builds</span>
        </div>

        {/* Center: Main Navigation */}
        <div className="command-pill nav-pill">
          <HashLink smooth to="/#work" className={`cmd-link ${activeSection === 'work' ? 'active' : ''}`}>Work</HashLink>
          <HashLink smooth to="/#services" className={`cmd-link ${activeSection === 'services' ? 'active' : ''}`}>Services</HashLink>
          <HashLink smooth to="/#standards" className={`cmd-link ${activeSection === 'standards' ? 'active' : ''}`}>Standards</HashLink>
          <HashLink smooth to="/#process" className={`cmd-link ${activeSection === 'process' ? 'active' : ''}`}>Process</HashLink>
        </div>

        {/* Right: Actions & Theme */}
        <div className="command-pill actions-pill">
          <button 
            onClick={toggleTheme}
            className="cmd-icon-btn"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Secondary Action: Login/Dashboard */}
          {currentUser ? (
            <div className="cmd-user-group">
              {currentUser.email === 'anvetechnologies@gmail.com' && (
                <Link to="/admin" className="cmd-link-secondary" aria-label="Admin Panel">Admin</Link>
              )}
              <Link to="/dashboard" className="cmd-link-secondary" aria-label="Dashboard">Dashboard</Link>
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); logout(); }} 
                className="cmd-icon-btn"
                aria-label="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="cmd-link-secondary" aria-label="Client Login">Login</Link>
          )}

          {/* Primary Action */}
          <HashLink 
            smooth
            to="/#contact" 
            className="cmd-primary-btn"
          >
            Discuss a Build
          </HashLink>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="command-pill cmd-mobile-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="cmd-mobile-menu"
            initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cmd-mobile-nav-items">
              <span className="mobile-menu-label">Navigation</span>
              <HashLink smooth to="/#work" onClick={() => setIsMobileMenuOpen(false)} className="mobile-cmd-link">Selected Work</HashLink>
              <HashLink smooth to="/#services" onClick={() => setIsMobileMenuOpen(false)} className="mobile-cmd-link">Services</HashLink>
              <HashLink smooth to="/#standards" onClick={() => setIsMobileMenuOpen(false)} className="mobile-cmd-link">Craft Standards</HashLink>
              <HashLink smooth to="/#process" onClick={() => setIsMobileMenuOpen(false)} className="mobile-cmd-link">Process</HashLink>
            </div>

            <div className="cmd-mobile-footer-actions">
              <span className="mobile-menu-label">System</span>
              <button 
                onClick={toggleTheme}
                className="mobile-cmd-link mobile-theme-toggle"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              {currentUser ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="mobile-cmd-link">
                    <User size={18} /> Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mobile-cmd-link text-error">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="mobile-cmd-link">
                  <LogIn size={18} /> Client Login
                </Link>
              )}

              <HashLink smooth to="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="cmd-primary-btn mobile-full-width-btn">
                Discuss a Build
              </HashLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
