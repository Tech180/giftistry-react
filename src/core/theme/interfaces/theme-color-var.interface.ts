import type { ThemeColors } from './theme-colors.interface';

/** Maps a ThemeColors field to its app + theme CSS custom properties. */
export interface ThemeColorVar {
  field: keyof ThemeColors;
  app: string;
  theme: string;
}
