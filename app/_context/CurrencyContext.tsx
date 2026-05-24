import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { CURRENCIES, DEFAULT_CURRENCY } from '@/constants/currency';
import type { Currency } from '@/constants/currency';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
});

export default function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    getItemAsync('currency').then((val) => {
      const found = CURRENCIES.find((c) => c.code === val);
      if (found) setCurrencyState(found);
    });
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    setItemAsync('currency', c.code);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyContext() {
  return useContext(CurrencyContext);
}
