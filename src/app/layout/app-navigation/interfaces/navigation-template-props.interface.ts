import type { RefObject } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import type { Theme } from 'app/providers/theme/interfaces/theme.type';
import type { Appearance } from 'app/providers/theme/interfaces/appearance.type';
import type { User } from 'features/auth';

export interface NavigationTemplateProps {
  user: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  isThemeUnlocked: (t: Theme) => boolean;
  customThemes?: { id: string; name: string }[];
  temporaryTheme?: { id: string; label: string } | null;
  handleLogout: () => void;
  navigate: NavigateFunction;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  mobileMenuRef: RefObject<HTMLDivElement | null>;
  hamburgerRef: RefObject<HTMLButtonElement | null>;
  showRegisterCta: boolean;
}
