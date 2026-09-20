import { rgbToHex } from '../color-conversion.util';
import { THEME_COLOR_VARS } from '../constants/theme-color-vars.constant';
import { THEME_COLORS_FALLBACK } from '../constants/theme-colors-fallback.constant';
import type { ThemeColors } from '../interfaces/theme-colors.interface';

function toEditorHex(value: string, fallback: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  if (trimmed.startsWith('rgb')) {
    return rgbToHex(trimmed);
  }

  return fallback;
}

export function readComputedThemeColors(): ThemeColors {
  if (typeof document === 'undefined') {
    return { ...THEME_COLORS_FALLBACK };
  }

  const computed = getComputedStyle(document.documentElement);
  const colors = { ...THEME_COLORS_FALLBACK };

  for (const { field, app, theme } of THEME_COLOR_VARS) {
    const appValue = computed.getPropertyValue(app).trim();
    const themeValue = computed.getPropertyValue(theme).trim();
    colors[field] = toEditorHex(appValue || themeValue, THEME_COLORS_FALLBACK[field]);
  }

  return colors;
}
