import { useState, useEffect } from 'react';
import Preloader from './components/Preloader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Projects from './components/Projects';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Privacy from './components/Privacy';
import Terms from './components/Terms';
import AdminPanel from './components/AdminPanel';
import UserAuth from './components/UserAuth';
import UserDashboard from './components/UserDashboard';
import { WorksProvider, useWorks } from './context/WorksContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppContent = ({ scrolled, currentPage }) => {
  const { incrementVisitors } = useWorks();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Basic visitor tracking logic (runs once per session load)
    const sessionVisited = sessionStorage.getItem('anve_tech_visited');
    if (!sessionVisited) {
      incrementVisitors();
      sessionStorage.setItem('anve_tech_visited', 'true');
    }
  }, []);

  return (
    <div className="app-container">
      {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'dashboard' && <Navbar scrolled={scrolled} />}
      
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

      {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'dashboard' && <Footer />}
      {currentPage !== 'admin' && currentPage !== 'login' && currentPage !== 'dashboard' && <Chatbot />}
    </div>
  );
};

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') setCurrentPage('privacy');
      else if (hash === '#terms') setCurrentPage('terms');
      else if (hash === '#admin') setCurrentPage('admin');
      else if (hash === '#login' || hash === '#signup') setCurrentPage('login');
      else if (hash === '#dashboard') setCurrentPage('dashboard');
      else setCurrentPage('home');
    };
    
    handleHashChange(); // Initial check
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
