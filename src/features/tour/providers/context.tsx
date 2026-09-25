import { createContext, useContext } from 'react';
import type { TourContextType } from './interfaces/context-type.interface';

export const TourContext = createContext<TourContextType | null>(null);

export function useTour(): TourContextType {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error('useTour must be used within TourProvider');
  }

  return ctx;
}

export function useTourOptional(): TourContextType | null {
  return useContext(TourContext);
}
