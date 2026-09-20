import { createContext, useContext } from 'react';
import type { UserSocketContextType } from './interfaces/context-type.interface';

export const UserSocketContext = createContext<UserSocketContextType | undefined>(undefined);

export function useUserSocket() {
  const context = useContext(UserSocketContext);
  if (context === undefined) {
    throw new Error('useUserSocket must be used within a UserSocketProvider');
  }

  return context;
}
