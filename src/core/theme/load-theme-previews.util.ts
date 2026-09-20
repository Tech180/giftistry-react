import type { ThemePreview } from './interfaces/theme-preview.interface';
import type { ThemePreviewColors } from './interfaces/theme-preview-colors.interface';
import { fetchThemePreviewColors } from './fetch-theme-preview-colors.util';
import type { ThemePickerOption } from './interfaces/theme-picker-option.interface';

const previewCache = new Map<string, ThemePreviewColors>();

export function themePreviewCacheKey(themeId: string, appearance: 'light' | 'dark'): string {
  return `${themeId}:${appearance}`;
}

export function clearThemePreviewCache(): void {
  previewCache.clear();
}

export function getThemePreviewCacheSize(): number {
  return previewCache.size;
}

async function getCachedPreviewColors(
  themeId: string,
  appearance: 'light' | 'dark',
): Promise<ThemePreviewColors> {
  const key = themePreviewCacheKey(themeId, appearance);
  const cached = previewCache.get(key);
  if (cached) return cached;

  const colors = await fetchThemePreviewColors(themeId, appearance);
  previewCache.set(key, colors);
  return colors;
}

export async function loadThemePreviews(
  themes: readonly ThemePickerOption[],
  appearance: 'light' | 'dark',
): Promise<ThemePreview[]> {
  return Promise.all(
    themes.map(async (theme) => {
      try {
        const colors = await getCachedPreviewColors(theme.value, appearance);
        return {
          id: theme.value,
          label: theme.label,
          primary: colors.primary,
          bg: colors.bg,
        };
      } catch {
        return {
          id: theme.value,
          label: theme.label,
          primary: '#6b7280',
          bg: '#111827',
        };
      }
    }),
  );
}
