import { createContext, useContext } from 'react';
import type { ContextValue } from './interfaces/context.interface';

export const MobilePageActionsContext = createContext<ContextValue | undefined>(undefined);

export function useMobilePageActions(): ContextValue {
  const context = useContext(MobilePageActionsContext);
  if (!context) {
    throw new Error('useMobilePageActions must be used within a MobilePageActionsProvider');
  }

  return context;
}
