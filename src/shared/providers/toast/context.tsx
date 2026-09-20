import { createContext, useContext } from 'react';
import type { ToastContextType } from './interfaces/context-type.interface';

export type { ToastItem } from './interfaces/item.interface';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}
