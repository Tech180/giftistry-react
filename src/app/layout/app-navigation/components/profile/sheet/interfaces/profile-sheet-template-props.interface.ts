import type { CSSProperties } from 'react';
import { LucideIcon } from 'lucide-react';
import { Appearance } from 'app/providers/theme/interfaces/appearance.type';
import { Theme } from 'app/providers/theme/interfaces/theme.type';
import { User } from 'features/auth';

export interface ProfileSheetActionView {
  id: string;
  label: string;
  icon: LucideIcon;
  danger?: boolean;
  onSelect: () => void;
}

export interface ProfileSheetTemplateProps {
  user: User;
  isActive: boolean;
  isProfileMenuOpen: boolean;
  avatarStyle: CSSProperties;
  avatarInitial: string;
  showAvatarInitials: boolean;
  actions: ProfileSheetActionView[];
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  isThemeUnlocked: (t: Theme) => boolean;
  onToggleProfileMenu: () => void;
}
