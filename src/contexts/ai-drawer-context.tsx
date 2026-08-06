'use client';

import React, { createContext, useContext, useState } from 'react';
import { AIContextType } from '@/types';

interface AIDrawerContextType {
  isOpen: boolean;
  contextType: AIContextType;
  contextTitle?: string;
  contextData?: any;
  openAIDrawer: (type?: AIContextType, title?: string, data?: any) => void;
  closeAIDrawer: () => void;
  toggleAIDrawer: () => void;
}

const AIDrawerContext = createContext<AIDrawerContextType>({
  isOpen: false,
  contextType: 'general',
  openAIDrawer: () => {},
  closeAIDrawer: () => {},
  toggleAIDrawer: () => {},
});

export const AIDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contextType, setContextType] = useState<AIContextType>('general');
  const [contextTitle, setContextTitle] = useState<string | undefined>();
  const [contextData, setContextData] = useState<any>(null);

  const openAIDrawer = (type: AIContextType = 'general', title?: string, data?: any) => {
    setContextType(type);
    setContextTitle(title);
    setContextData(data);
    setIsOpen(true);
  };

  const closeAIDrawer = () => setIsOpen(false);
  const toggleAIDrawer = () => setIsOpen((prev) => !prev);

  return (
    <AIDrawerContext.Provider
      value={{
        isOpen,
        contextType,
        contextTitle,
        contextData,
        openAIDrawer,
        closeAIDrawer,
        toggleAIDrawer,
      }}
    >
      {children}
    </AIDrawerContext.Provider>
  );
};

export const useAIDrawer = () => useContext(AIDrawerContext);
