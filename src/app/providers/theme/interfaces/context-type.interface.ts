import { Theme } from './theme.type';
import { Appearance } from './appearance.type';
import type { CustomThemeProfile } from './custom-theme-profile.interface';

export interface ThemeContextType {
  theme: Theme;
  appearance: Appearance;
  setTheme: (theme: Theme) => void;
  setAppearance: (appearance: Appearance) => void;
  toggleAppearance: () => void;
  unlockedThemes: Theme[];
  isThemeUnlocked: (theme: Theme) => boolean;
  temporaryTheme: { id: string; label: string } | null;
  tryTheme: (theme: string, ownerUsername: string) => void;
  customThemes: CustomThemeProfile[];
  saveCustomTheme: (profile: CustomThemeProfile) => Promise<void>;
  deleteCustomTheme: (id: string) => Promise<void>;
}
