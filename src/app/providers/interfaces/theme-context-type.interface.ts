import { Theme, Appearance } from '../ThemeContext';

export interface ThemeContextType {
  theme: Theme;
  appearance: Appearance;
  setTheme: (theme: Theme) => void;
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
}
