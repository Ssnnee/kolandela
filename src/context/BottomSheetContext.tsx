import React, { createContext, useContext, useRef } from 'react';

interface BottomSheetContextType {
  openBottomSheet: () => void;
  closeBottomSheet: () => void;
  bottomSheetRef: React.MutableRefObject<any>;
}

const BottomSheetContext = createContext<BottomSheetContextType>({
  openBottomSheet: () => { },
  closeBottomSheet: () => { },
  bottomSheetRef: { current: null },
});

export default function BottomSheetProvider({ children }: { children: React.ReactNode }) {
  const bottomSheetRef = useRef<any>(null);

  const openBottomSheet = () => bottomSheetRef.current?.open();
  const closeBottomSheet = () => bottomSheetRef.current?.close();

  return (
    <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet, bottomSheetRef }}>
      {children}
    </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  return useContext(BottomSheetContext);
}
