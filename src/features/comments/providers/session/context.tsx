import { createContext, useContext } from 'react';
import type { CommentsSessionContextType } from './interfaces/context-type.interface';

export const CommentsSessionContext = createContext<CommentsSessionContextType | undefined>(
  undefined
);

export function useCommentsSession(): CommentsSessionContextType {
  const context = useContext(CommentsSessionContext);
  if (context === undefined) {
    throw new Error('useCommentsSession must be used within a CommentsSessionProvider');
  }

  return context;
}
