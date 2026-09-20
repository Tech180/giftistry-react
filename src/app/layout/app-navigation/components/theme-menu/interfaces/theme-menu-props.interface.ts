import type { Appearance } from 'app/providers/theme/interfaces/appearance.type';
import type { Theme } from 'app/providers/theme/interfaces/theme.type';

export interface ThemeMenuProps {
  theme: Theme;
  appearance: Appearance;
  setTheme: (theme: Theme) => void;
  setAppearance: (appearance: Appearance) => void;
  isThemeUnlocked: (theme: Theme) => boolean;
  customThemes?: { id: string; name: string }[];
  temporaryTheme?: { id: string; label: string } | null;
}
