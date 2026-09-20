import { createContext, useContext } from 'react';
import { ThemeContextType } from './interfaces/context-type.interface';

export type { Theme } from './interfaces/theme.type';
export type { Appearance } from './interfaces/appearance.type';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
