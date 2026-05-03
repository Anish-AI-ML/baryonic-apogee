import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';
import './UserAuth.css';

const UserAuth = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, signup, resetPassword, updatePassword } = useAuth();
  
  const isResetHash = window.location.hash.includes('reset') || window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      if (isResetHash) {
        await updatePassword(formData.password.trim());
        setSuccessMsg('Password updated successfully! Redirecting...');
        setTimeout(() => window.location.hash = '#dashboard', 2000);
      } else if (isForgotPassword) {
        await resetPassword(formData.email.trim());
        setSuccessMsg('Reset link sent! Please check your email.');
      } else if (isLogin) {
        const email = formData.email.trim();
        const password = formData.password.trim();
        
        console.log("----- LOGIN DEBUG INFO -----");
        console.log("Email being sent:", email);
        console.log("Password length:", password.length);
        console.log("Supabase URL used:", import.meta.env.VITE_SUPABASE_URL);
        console.log("----------------------------");

        const data = await login(email, password);
        if (data?.user) {
          window.location.hash = '#dashboard';
        }
      } else {
        const result = await signup(formData);
        if (result && result.status === 'logged_in') {
          window.location.hash = '#dashboard';
        } else {
          setIsVerifying(true);
        }
      }
    } catch (err) {
      console.error("Login catch block error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  if (isVerifying) {
    return (
      <div className="auth-page">
        <div className="auth-background"><div className="auth-blob"></div><div className="auth-blob-2"></div></div>
        <div className="auth-container">
          <motion.div className="auth-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="auth-header" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '20px', borderRadius: '50%', color: '#ec4899' }}>
                  <Mail size={40} />
                </div>
              </div>
              <h2>Check Your Email</h2>
              <p style={{ marginTop: '10px' }}>
                We've sent a secure confirmation link to<br />
                <strong style={{ color: '#ec4899' }}>{formData.email}</strong>
              </p>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '20px', lineHeight: '1.6' }}>
                Please click the link in the email to automatically activate your account and access your dashboard.
              </p>
            </div>

            <div className="auth-footer" style={{ marginTop: '30px' }}>
              <p>Didn't get the email? <button onClick={() => setIsVerifying(false)}>Try signing up again</button></p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-blob"></div>
        <div className="auth-blob-2"></div>
      </div>

      <div className="auth-container">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <h2>{isResetHash ? 'Reset Password' : isForgotPassword ? 'Forgot Password' : isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isResetHash ? 'Enter a strong new password for your account' : isForgotPassword ? 'Enter your email to receive a password reset link' : isLogin ? 'Enter your credentials to access your account' : 'Join Anve tech and start building the future'}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label><User size={16} /> Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-group" style={{ display: isResetHash ? 'none' : 'block' }}>
              <label><Mail size={16} /> Email Address</label>
              <input
                type="email"
                placeholder="enter your email here"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required={!isResetHash}
              />
            </div>

            {!isForgotPassword && (
              <div className="form-group">
                <label><Lock size={16} /> {isResetHash ? 'New Password' : 'Password'}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            )}

            {!isResetHash && !isForgotPassword && isLogin && (
              <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                <span onClick={() => { setIsForgotPassword(true); setError(''); setSuccessMsg(''); }} style={{ color: '#a855f7', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>Forgot Password?</span>
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}
            {successMsg && <p className="auth-error" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid #10b981' }}>{successMsg}</p>}

            <button type="submit" className="btn btn-white auth-submit" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}>
              {isLoading ? 'Processing...' : (
                <>{isResetHash ? 'Update Password' : isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Get Started'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          <div className="auth-footer">
            {isResetHash ? (
               <p><button onClick={() => window.location.hash = '#login'}>Back to Login</button></p>
            ) : isForgotPassword ? (
               <p><button onClick={() => { setIsForgotPassword(false); setError(''); setSuccessMsg(''); }}>Back to Login</button></p>
            ) : isLogin ? (
              <p>Don't have an account? <button onClick={() => setIsLogin(false)}>Sign Up</button></p>
            ) : (
              <p>Already have an account? <button onClick={() => setIsLogin(true)}>Sign In</button></p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserAuth;
