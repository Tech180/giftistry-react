import type { ReactNode } from 'react';

export interface ProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
  userId?: string;
}
