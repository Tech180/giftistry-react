import { NavigateFunction } from 'react-router-dom';
import { Appearance } from 'app/providers/theme/interfaces/appearance.type';
import { Theme } from 'app/providers/theme/interfaces/theme.type';
import { User } from 'features/auth';

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
