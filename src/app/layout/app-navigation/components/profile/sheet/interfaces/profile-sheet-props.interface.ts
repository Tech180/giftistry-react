import { NavigateFunction } from 'react-router-dom';
import { Appearance } from 'app/providers/interfaces/appearance.interface';
import { Theme } from 'app/providers/interfaces/theme.interface';
import { User } from 'app/providers/interfaces/user.interface';

export interface ProfileSheetProps {
  user: User;
  isActive: boolean;
  onClose: () => void;
  navigate: NavigateFunction;
  handleLogout: () => void;
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  isThemeUnlocked: (t: Theme) => boolean;
}
