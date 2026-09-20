import { createContext, useContext } from 'react';
import type { FriendsContextType } from './interfaces/context-type.interface';

export const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export function useFriendsController(): FriendsContextType {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error('useFriendsController must be used within a FriendsProvider');
  }

  return context;
}
