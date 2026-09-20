import type { ThemeColors } from '../interfaces/theme-colors.interface';

/** Last resort when computed CSS is unavailable (tests/SSR). Live engine CSS wins. */
export const THEME_COLORS_FALLBACK: ThemeColors = {
  primary: '#5e6ad2',
  bg: '#0f0f10',
  surface: '#151516',
  border: '#262629',
  text: '#f7f8f8',
  'text-muted': '#8a8f98',
};
