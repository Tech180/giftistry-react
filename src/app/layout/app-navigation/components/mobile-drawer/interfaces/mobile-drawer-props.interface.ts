import { RefObject } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Theme } from 'app/providers/theme/interfaces/theme.type';
import { Appearance } from 'app/providers/theme/interfaces/appearance.type';
import { User } from 'features/auth';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  isAuthenticated: boolean;
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  isThemeUnlocked: (t: Theme) => boolean;
  handleLogout: () => void;
  navigate: NavigateFunction;
  drawerRef: RefObject<HTMLDivElement | null>;
  showRegisterCta: boolean;
}
