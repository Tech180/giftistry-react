import { createContext, useContext } from 'react';
import type { WishlistSessionContextType } from './interfaces/context-type.interface';

export const WishlistSessionContext = createContext<WishlistSessionContextType | undefined>(
  undefined
);

export function useWishlistSession(): WishlistSessionContextType {
  const context = useContext(WishlistSessionContext);
  if (context === undefined) {
    throw new Error('useWishlistSession must be used within a WishlistSessionProvider');
  }

  return context;
}
