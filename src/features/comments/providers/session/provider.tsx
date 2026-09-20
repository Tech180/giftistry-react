import type { ReactNode } from 'react';
import { useAuth } from 'features/auth';
import { CommentsSessionContext } from './context';

export function CommentsSessionProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  return (
    <CommentsSessionContext.Provider
      value = {
        { user, isAuthenticated }
      }
    >
      {children}
    </CommentsSessionContext.Provider>
  );
}
