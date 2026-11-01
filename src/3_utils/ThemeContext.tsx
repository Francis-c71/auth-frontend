
import { createContext, useContext, useEffect, useState, type ReactNode,} from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>( undefined,);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    return document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark', );

    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark',);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
