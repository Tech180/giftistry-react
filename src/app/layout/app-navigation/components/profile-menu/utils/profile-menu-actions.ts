import { LucideIcon, Settings, Users, LogOut } from 'lucide-react';

export type ProfileMenuActionId = 'settings' | 'friends' | 'logout';

export interface ProfileMenuAction {
  id: ProfileMenuActionId;
  label: string;
  icon: LucideIcon;
  path?: string;
  danger?: boolean;
}

/** Shared selection set for top-nav and drawer profile menus. */
export const PROFILE_MENU_ACTIONS: readonly ProfileMenuAction[] = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings/account' },
  { id: 'friends', label: 'Friends', icon: Users, path: '/friends/current' },
  { id: 'logout', label: 'Sign Out', icon: LogOut, danger: true },
];
