import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch (e) {
    console.warn('localStorage is not accessible:', e);
  }

  // System preference check
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch (e) {
    console.warn('matchMedia is not accessible:', e);
  }

  return 'dark'; // default fallback
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  // Sync theme to HTML attribute on initial load
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      console.error('Failed to set theme attribute:', e);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    
    // Add temporary transitioning class
    try {
      document.documentElement.classList.add('theme-transitioning');
    } catch (e) {
      console.warn('Failed to add theme-transitioning class:', e);
    }

    setThemeState(newTheme);

    try {
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.warn('Failed to persist theme:', e);
    }

    // Clean up temporary transition class after transition finishes (250ms)
    setTimeout(() => {
      try {
        document.documentElement.classList.remove('theme-transitioning');
      } catch (e) {
        console.warn('Failed to remove theme-transitioning class:', e);
      }
    }, 250);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
