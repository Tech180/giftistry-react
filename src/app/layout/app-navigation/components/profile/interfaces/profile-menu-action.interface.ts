import type { LucideIcon } from 'lucide-react';
import type { ProfileMenuActionId } from './profile-menu-action-id.type';

export interface ProfileMenuAction {
  id: ProfileMenuActionId;
  label: string;
  icon: LucideIcon;
  path?: string;
  danger?: boolean;
}
