import type { ReactNode } from 'react';
import { useAuth } from 'features/auth';
import { ItemsSessionContext } from './context';

export function ItemsSessionProvider({ children }: { children: ReactNode }) {
  const { user, canShowAi } = useAuth();

  return (
    <ItemsSessionContext.Provider
      value = {
        { user, canShowAi }
      }
    >
      {children}
    </ItemsSessionContext.Provider>
  );
}
