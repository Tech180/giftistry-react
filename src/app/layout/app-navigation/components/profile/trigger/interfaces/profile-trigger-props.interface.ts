import type { User } from 'features/auth';

export interface ProfileTriggerProps {
  user: User;
  onLogout: () => void;
}
