
import React, { createContext, useContext, ReactNode } from 'react';
import { AppContextType, Season } from '../types';
import { useMockDatabase } from '../hooks/useMockDatabase';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const db = useMockDatabase();
  return <AppContext.Provider value={db}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
