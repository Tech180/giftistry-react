import { createContext, useContext } from 'react';
import type { DemoListContextType } from './interfaces/context-type.interface';

export const DemoListContext = createContext<DemoListContextType | null>(null);

export function useTourDemo(): DemoListContextType {
  const ctx = useContext(DemoListContext);
  if (!ctx) {
    throw new Error('useTourDemo must be used within DemoListProvider');
  }

  return ctx;
}

export function useTourDemoOptional(): DemoListContextType | null {
  return useContext(DemoListContext);
}
