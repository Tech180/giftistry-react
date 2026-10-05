import { Settings, LogOut } from 'lucide-react';
import type { ProfileMenuAction } from '../interfaces/profile-menu-action.interface';

/** Shared selection set for top-nav and drawer profile menus. */
export const PROFILE_MENU_ACTIONS: readonly ProfileMenuAction[] = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings/account' },
  { id: 'logout', label: 'Sign Out', icon: LogOut, danger: true },
];
