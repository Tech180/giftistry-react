import type { Appearance } from 'app/providers/interfaces/appearance.interface';
import type { Theme } from 'app/providers/interfaces/theme.interface';

export interface ThemeMenuProps {
  theme: Theme;
  appearance: Appearance;
  setTheme: (theme: Theme) => void;
  setAppearance: (appearance: Appearance) => void;
  isThemeUnlocked: (theme: Theme) => boolean;
  customThemes?: { id: string; name: string }[];
  temporaryTheme?: { id: string; label: string } | null;
}
