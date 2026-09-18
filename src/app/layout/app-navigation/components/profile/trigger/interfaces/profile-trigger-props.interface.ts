import type { User } from 'app/providers/interfaces/user.interface';

export interface ProfileTriggerProps {
  user: User;
  onLogout: () => void;
}
