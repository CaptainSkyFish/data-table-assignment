import { createContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'light';
  });

  useEffect(() => {
    const existingLink = document.getElementById('theme-link');
    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement('link');
    link.id = 'theme-link';
    link.rel = 'stylesheet';
    link.href = theme === 'dark'
      ? '/themes/md-dark-indigo/theme.css'
      : '/themes/md-light-indigo/theme.css';

    document.head.appendChild(link);

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


