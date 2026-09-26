import { createContext, useContext } from 'react';
import type { ContextValue } from './interfaces/context.interface';

export const AppLoadingContext = createContext<ContextValue | undefined>(undefined);

export function useAppLoading(): ContextValue {
  const context = useContext(AppLoadingContext);
  if (!context) {
    throw new Error('useAppLoading must be used within an AppLoadingProvider');
  }

  return context;
}
