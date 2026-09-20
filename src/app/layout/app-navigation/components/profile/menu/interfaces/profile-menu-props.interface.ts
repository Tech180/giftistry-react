import { User } from 'features/auth';

export interface ProfileMenuProps {
  user: User;
  onSettings: () => void;
  onFriends: () => void;
  onLogout: () => void;
  placement?: 'down' | 'up';
  className?: string;
}
