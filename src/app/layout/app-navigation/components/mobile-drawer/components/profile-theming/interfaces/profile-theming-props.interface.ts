import { Appearance } from 'app/providers/interfaces/appearance.interface';
import { Theme } from 'app/providers/interfaces/theme.interface';

export interface ProfileThemingProps {
  theme: Theme;
  appearance: Appearance;
  setTheme: (t: Theme) => void;
  setAppearance: (a: Appearance) => void;
  isThemeUnlocked: (t: Theme) => boolean;
  /** When false, controls are not tabbable (sheet collapsed). */
  interactive: boolean;
  /** When false, swatch carousel offset resets to 0 (drawer inactive). */
  isActive: boolean;
}
