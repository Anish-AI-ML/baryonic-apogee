import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Preloader from './components/common/Preloader';
import ErrorBoundary from './components/common/ErrorBoundary';
import { WorksProvider } from './context/WorksContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Home from './pages/Home';

// Lazy loaded heavy components
const Privacy = lazy(() => import('./components/features/legal/Privacy'));
const Terms = lazy(() => import('./components/features/legal/Terms'));
const AdminPanel = lazy(() => import('./components/features/admin/AdminPanel'));
const UserAuth = lazy(() => import('./components/features/auth/UserAuth'));
const UserDashboard = lazy(() => import('./components/features/dashboard/UserDashboard'));
const SocialLinksPage = lazy(() => import('./components/features/social/SocialLinksPage'));

const AuthCallbackHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Intercept Supabase implicit grant recovery tokens from emails
    const hash = location.hash;
    const search = location.search;
    
    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      navigate('/login?type=recovery' + (hash ? `&${hash.substring(1)}` : ''));
    }
  }, [location, navigate]);

  return null;
};

const ScrollHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
};

const AppContent = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <AuthCallbackHandler />
      <ScrollHandler />
      
      <Suspense fallback={<Preloader onFinish={() => {}} />}>
        <Routes>
          {/* Routes WITH Navbar and Footer */}
          <Route element={<MainLayout scrolled={scrolled} />}>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Route>

          {/* Independent Routes */}
          <Route path="/login" element={<UserAuth />} />
          
          <Route path="/links" element={
            <ErrorBoundary>
              <SocialLinksPage />
            </ErrorBoundary>
          } />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </div>
  );
};

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <Router>
      <AuthProvider>
        <WorksProvider>
          {showPreloader ? (
            <Preloader onFinish={() => setShowPreloader(false)} />
          ) : (
            <AppContent />
          )}
        </WorksProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
