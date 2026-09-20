import { env } from 'core/config/env';
import type { ThemePreviewColors } from './interfaces/theme-preview-colors.interface';
import { parseThemePreviewColors } from './parse-theme-preview-colors.util';

export async function fetchThemePreviewColors(
  themeId: string,
  appearance: 'light' | 'dark',
): Promise<ThemePreviewColors> {
  const url = `${env.apiUrl}/api/themes/${themeId}/${appearance}/css`;
  const response = await fetch(url, {
    headers: { Accept: 'text/css,*/*' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to load theme CSS for ${themeId}/${appearance}`);
  }

  const cssText = await response.text();
  return parseThemePreviewColors(cssText);
}
