import type { CSSProperties, RefObject } from 'react';
import type { User } from 'features/auth';

export interface ProfileTriggerTemplateProps {
  user: User;
  profileRef: RefObject<HTMLDivElement | null>;
  isProfileOpen: boolean;
  onToggleProfile: () => void;
  avatarStyle: CSSProperties;
  avatarInitial: string;
  showAvatarInitials: boolean;
  onSettings: () => void;
  onFriends: () => void;
  onLogout: () => void;
}
