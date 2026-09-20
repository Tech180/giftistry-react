import type { LucideIcon } from 'lucide-react';
import type { User } from 'features/auth';
import type { ProfileMenuActionId } from '../../interfaces/profile-menu-action-id.type';

export interface ProfileMenuActionView {
  id: ProfileMenuActionId;
  label: string;
  icon: LucideIcon;
  danger?: boolean;
  onSelect: () => void;
}

export interface ProfileMenuTemplateProps {
  user: User;
  menuClassName: string;
  actions: ProfileMenuActionView[];
}
