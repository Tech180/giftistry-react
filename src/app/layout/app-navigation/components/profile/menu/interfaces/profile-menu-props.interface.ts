import { User } from 'features/auth';

export interface ProfileMenuProps {
  user: User;
  onSettings: () => void;
  onLogout: () => void;
  placement?: 'down' | 'up';
  className?: string;
}
