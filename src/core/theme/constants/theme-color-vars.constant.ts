import type { ThemeColorVar } from '../interfaces/theme-color-var.interface';

/** App + theme CSS custom property names for editor color seeding. */
export const THEME_COLOR_VARS: readonly ThemeColorVar[] = [
  { field: 'primary', app: '--primary', theme: '--theme-primary' },
  { field: 'bg', app: '--bg', theme: '--theme-bg' },
  { field: 'surface', app: '--surface', theme: '--theme-surface' },
  { field: 'border', app: '--border', theme: '--theme-border' },
  { field: 'text', app: '--text', theme: '--theme-text' },
  { field: 'text-muted', app: '--text-muted', theme: '--theme-text-muted' },
];
