import type { User } from './user.interface';

export interface UseInactivityOptions {
  user: User | null;
  onTimeoutLogout: () => void;
}
