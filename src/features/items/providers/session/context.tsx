import { createContext, useContext } from 'react';
import type { ItemsSessionContextType } from './interfaces/context-type.interface';

export const ItemsSessionContext = createContext<ItemsSessionContextType | undefined>(undefined);

export function useItemsSession(): ItemsSessionContextType {
  const context = useContext(ItemsSessionContext);
  if (context === undefined) {
    throw new Error('useItemsSession must be used within an ItemsSessionProvider');
  }

  return context;
}
