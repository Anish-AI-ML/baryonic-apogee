import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('anve_tech_users');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('anve_tech_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('anve_tech_users', JSON.stringify(users));
  }, [users]);

  // Sync session across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'anve_tech_session') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setCurrentUser(newUser);
      }
      if (e.key === 'anve_tech_users' && e.newValue) {
        setUsers(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signup = (userData) => {
    const userExists = users.find(u => u.email === userData.email);
    if (userExists) throw new Error('Email already registered');

    const newUser = { ...userData, id: Date.now(), joinedAt: new Date().toISOString() };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('anve_tech_session', JSON.stringify(newUser));
    return newUser;
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');

    setCurrentUser(user);
    localStorage.setItem('anve_tech_session', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('anve_tech_session');
  };

  const updateProfile = (userId, updatedData) => {
    // Determine updated user object
    const updatedUser = { ...currentUser, ...updatedData };
    
    // Update global users array
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    
    // Update current session
    setCurrentUser(updatedUser);
    localStorage.setItem('anve_tech_session', JSON.stringify(updatedUser));

    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
