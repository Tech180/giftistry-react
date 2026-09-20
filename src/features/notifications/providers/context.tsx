import { createContext, useContext } from 'react';
import type { ContextType } from './interfaces/context-type.interface';

export const NotificationsContext = createContext<ContextType | undefined>(undefined);

export function useNotifications(): ContextType {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }

  return context;
}
