import { User } from 'app/providers/interfaces/user.interface';

export interface ProfileMenuProps {
  user: User;
  onSettings: () => void;
  onFriends: () => void;
  onLogout: () => void;
  placement?: 'down' | 'up';
  className?: string;
}
