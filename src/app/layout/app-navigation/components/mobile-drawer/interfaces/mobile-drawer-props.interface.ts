import { RefObject } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Theme } from 'app/providers/interfaces/theme.interface';
import { Appearance } from 'app/providers/interfaces/appearance.interface';
import { User } from 'app/providers/interfaces/user.interface';

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
}
