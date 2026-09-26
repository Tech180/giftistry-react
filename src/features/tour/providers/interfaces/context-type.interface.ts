import type { TourChapterId } from 'features/auth';

export interface TourContextType {
  isActive: boolean;
  activeChapterId: TourChapterId | null;
  activeStepId: string | null;
  createdListId: string | null;
  setCreatedListId: (id: string | null) => void;
  startChapter: (id: TourChapterId) => Promise<void>;
  next: () => Promise<void>;
  back: () => void;
  skipStep: () => Promise<void>;
  completeChapter: () => Promise<void>;
  skipChapter: () => Promise<void>;
  finishTour: () => Promise<void>;
  restartAll: () => Promise<void>;
  /** Persist Show welcome on and start the first pending chapter when inactive. */
  reenableWelcome: () => Promise<void>;
  /** Persist Show welcome off; finishes an active tour if needed. */
  dismissWelcome: () => Promise<void>;
  notifyEvent: (event: string, payload?: { listId?: string }) => void;
  isDemoActive: boolean;
}
