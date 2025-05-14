import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeState } from '../types';

interface ThemeContextType extends ThemeState {
  toggleDarkMode: () => void;
}

const defaultThemeState: ThemeState = {
  darkMode: false,
};

const ThemeContext = createContext<ThemeContextType>({
  ...defaultThemeState,
  toggleDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeState, setThemeState] = useState<ThemeState>(defaultThemeState);

  useEffect(() => {
    // Check if theme preference is stored in localStorage
    const storedTheme = localStorage.getItem('weatherTheme');
    if (storedTheme) {
      try {
        const theme = JSON.parse(storedTheme);
        setThemeState(theme);
        if (theme.darkMode) {
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Failed to parse stored theme:', error);
        localStorage.removeItem('weatherTheme');
      }
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeState({ darkMode: prefersDark });
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setThemeState(prevState => {
      const newState = { darkMode: !prevState.darkMode };
      
      // Update the HTML class for dark mode
      if (newState.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Store the preference in localStorage
      localStorage.setItem('weatherTheme', JSON.stringify(newState));
      
      return newState;
    });
  };

  return (
    <ThemeContext.Provider value={{ ...themeState, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};