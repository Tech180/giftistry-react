import { Theme, Appearance } from '../theme-context';

export interface ThemeContextType {
  theme: Theme;
  appearance: Appearance;
  setTheme: (theme: Theme) => void;
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
  unlockedThemes: Theme[];
  isThemeUnlocked: (theme: Theme) => boolean;
}
