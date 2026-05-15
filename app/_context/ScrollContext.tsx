import React, { createContext, useContext, useState } from 'react';

interface ScrollContextType {
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  isVisible: true,
  setIsVisible: () => { },
});

export default function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <ScrollContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  return useContext(ScrollContext);
}
