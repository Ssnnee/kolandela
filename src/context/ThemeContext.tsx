import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => { },
});

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');

  useEffect(() => {
    getItemAsync('theme').then((val) => {
      if (val === 'light' || val === 'dark' || val === 'system') {
        setThemeState(val);
      }
    });
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    setItemAsync('theme', t);
  };

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemScheme ?? 'dark') : theme;

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
