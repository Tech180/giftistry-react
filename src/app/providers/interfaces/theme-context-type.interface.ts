import { Theme } from './theme.interface';
import { Appearance } from './appearance.interface';

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
  customThemes: any[];
  saveCustomTheme: (profile: any) => Promise<void>;
  deleteCustomTheme: (id: string) => Promise<void>;
}
