import { CustomThemeInput } from './interfaces/custom-theme-input.interface';
import { CUSTOM_THEME_VARS } from './constants/custom-theme-vars.constant';
import { hexToRgbComma } from './color-conversion.util';

export type { CustomThemeInput } from './interfaces/custom-theme-input.interface';
export { hexToRgbComma as hexToRgb } from './color-conversion.util';
export { CUSTOM_THEME_VARS } from './constants/custom-theme-vars.constant';

export function applyCustomTheme(profile: CustomThemeInput): void {
  const { colors, advanced } = profile;
  const root = document.documentElement;

  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-hover', `${colors.primary}dd`);
  root.style.setProperty('--primary-rgb', hexToRgbComma(colors.primary));
  root.style.setProperty('--bg', colors.bg);
  root.style.setProperty('--surface', colors.surface);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--text', colors.text);
  root.style.setProperty('--text-muted', colors['text-muted'] || colors.textMuted || colors.text);

  if (advanced?.shadows) {
    if (advanced.shadows.sm) {
      root.style.setProperty('--shadow-sm', advanced.shadows.sm);
    }
    if (advanced.shadows.md) {
      root.style.setProperty('--shadow', advanced.shadows.md);
    }
    if (advanced.shadows.lg) {
      root.style.setProperty('--shadow-lg', advanced.shadows.lg);
    }
  }

  if (advanced?.fonts?.sans) {
    root.style.setProperty('--font-family-body', advanced.fonts.sans);
    root.style.setProperty('--font-family-display', advanced.fonts.sans);
  }

  if (advanced?.radius?.default) {
    root.style.setProperty('--radius', advanced.radius.default);
  }
}

export function clearCustomTheme(): void {
  CUSTOM_THEME_VARS.forEach((v) => document.documentElement.style.removeProperty(v));
}
