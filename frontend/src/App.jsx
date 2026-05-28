import { useState, useEffect } from 'react';
import Preloader from './components/common/Preloader';
import Navbar from './components/layout/Navbar';
import Hero from './components/features/hero/Hero';
import Services from './components/features/services/Services';
import About from './components/features/about/About';
import HowItWorks from './components/features/how-it-works/HowItWorks';
import Projects from './components/features/projects/Projects';
import WhyChooseUs from './components/features/why-choose-us/WhyChooseUs';
import Contact from './components/features/contact/Contact';
import Footer from './components/layout/Footer';
import Chatbot from './components/features/chatbot/Chatbot';
import Privacy from './components/features/legal/Privacy';
import Terms from './components/features/legal/Terms';
import AdminPanel from './components/features/admin/AdminPanel';
import UserAuth from './components/features/auth/UserAuth';
import UserDashboard from './components/features/dashboard/UserDashboard';
import SocialLinksPage from './components/features/social/SocialLinksPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import { WorksProvider } from './context/WorksContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = ({ scrolled, currentPage }) => {
  const { currentUser } = useAuth();

  return (
    <div className="app-container">
      {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'dashboard' && currentPage !== 'links' && <Navbar scrolled={scrolled} />}
      
      {currentPage === 'privacy' ? (
        <Privacy />
      ) : currentPage === 'terms' ? (
        <Terms />
      ) : currentPage === 'admin' ? (
        <AdminPanel />
      ) : currentPage === 'login' ? (
        <UserAuth />
      ) : currentPage === 'dashboard' ? (
        <UserDashboard />
      ) : currentPage === 'links' ? (
        <ErrorBoundary>
          <SocialLinksPage />
        </ErrorBoundary>
      ) : (
        <main>
          <Hero />
          <Services />
          <About />
          <HowItWorks />
          <Projects />
          <WhyChooseUs />
          <Contact />
        </main>
      )}

      {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'dashboard' && currentPage !== 'links' && <Footer />}
      {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'dashboard' && currentPage !== 'links' && <Chatbot />}
    </div>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      
      // Instantly intercept Supabase recovery tokens from emails before anything else
      // DO NOT OVERWRITE THE HASH here, or Supabase Auth will lose the access_token before parsing it!
      if (hash.includes('type=recovery') || search.includes('type=recovery')) {
        setCurrentPage('login');
        return;
      }

      if (hash === '#privacy') setCurrentPage('privacy');
      else if (hash === '#terms') setCurrentPage('terms');
      else if (hash === '#admin') setCurrentPage('admin');
      else if (hash === '#login' || hash === '#signup' || hash === '#reset') setCurrentPage('login');
      else if (hash === '#dashboard') setCurrentPage('dashboard');
      else if (hash === '#links') setCurrentPage('links');
      else {
        setCurrentPage('home');
        // Force scroll jump after React mounts the Home elements 
        // to fix broken anchor links when navigating from other pages (e.g. Privacy -> #services)
        if (['#services', '#about', '#how-it-works', '#projects', '#why', '#contact', '#home'].includes(hash)) {
          setTimeout(() => {
            const el = document.getElementById(hash === '#home' ? 'home' : hash.substring(1));
            // Ensure we smoothly jump, catching misfires from the browser's native initial jump that occurs before page render
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100); 
        } else if (hash === '') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <AuthProvider>
      <WorksProvider>
        {showPreloader ? (
          <Preloader onFinish={() => setShowPreloader(false)} />
        ) : (
          <AppContent scrolled={scrolled} currentPage={currentPage} />
        )}
      </WorksProvider>
    </AuthProvider>
  );
}

export default App;
