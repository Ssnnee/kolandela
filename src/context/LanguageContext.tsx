import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { translate, LanguageCode } from '../_i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
  t: (path) => path,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    getItemAsync('app_lang').then((val) => {
      if (val === 'en' || val === 'fr') setLanguageState(val);
    });
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    setItemAsync('app_lang', lang);
  };

  const t = (path: string, params?: Record<string, string | number>) => translate(language, path, params);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useTranslation = () => useContext(LanguageContext);
