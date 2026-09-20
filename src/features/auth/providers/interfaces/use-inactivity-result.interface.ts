import type { Dispatch, SetStateAction } from 'react';

export interface UseInactivityResult {
  showWarning: boolean;
  countdown: number;
  extendSession: () => void;
  cleanupInactivityTimers: () => void;
  setShowWarning: Dispatch<SetStateAction<boolean>>;
}
