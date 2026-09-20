import { afterEach, describe, expect, test, vi } from 'vitest';
import { parseThemePreviewColors } from './parse-theme-preview-colors.util';
import {
  clearThemePreviewCache,
  getThemePreviewCacheSize,
  loadThemePreviews,
  themePreviewCacheKey,
} from './load-theme-previews.util';

vi.mock('./fetch-theme-preview-colors.util', () => ({
  fetchThemePreviewColors: vi.fn(async (themeId: string, appearance: string) => {
    if (themeId === 'fail') throw new Error('boom');
    return {
      primary: `#${themeId.slice(0, 3)}${appearance === 'dark' ? '111' : 'eee'}`,
      bg: appearance === 'dark' ? '#0a0a0a' : '#fafafa',
    };
  }),
}));

describe('parseThemePreviewColors', () => {
  test('reads --theme-primary and --theme-bg', () => {
    const css = `
      [data-theme="default"] {
        --theme-primary: #5e6ad2;
        --theme-bg: #0f0f10;
      }
    `;
    expect(parseThemePreviewColors(css)).toEqual({
      primary: '#5e6ad2',
      bg: '#0f0f10',
    });
  });

  test('falls back to --primary and --bg', () => {
    const css = `
      :root {
        --primary: #ff0055;
        --bg: #1a0033;
      }
    `;
    expect(parseThemePreviewColors(css)).toEqual({
      primary: '#ff0055',
      bg: '#1a0033',
    });
  });

  test('throws when vars are missing', () => {
    expect(() => parseThemePreviewColors('/* empty */')).toThrow(/Missing CSS vars/);
  });
});

describe('loadThemePreviews cache', () => {
  afterEach(() => {
    clearThemePreviewCache();
    vi.clearAllMocks();
  });

  test('builds cache keys as themeId:appearance', () => {
    expect(themePreviewCacheKey('neon', 'dark')).toBe('neon:dark');
  });

  test('caches by themeId:appearance across calls', async () => {
    const { fetchThemePreviewColors } = await import('./fetch-theme-preview-colors.util');

    const themes = [
      { value: 'neon', label: 'Neon' },
      { value: 'matrix', label: 'Matrix' },
    ];

    const first = await loadThemePreviews(themes, 'dark');
    expect(first).toHaveLength(2);
    expect(getThemePreviewCacheSize()).toBe(2);
    expect(fetchThemePreviewColors).toHaveBeenCalledTimes(2);

    const second = await loadThemePreviews(themes, 'dark');
    expect(second).toEqual(first);
    expect(fetchThemePreviewColors).toHaveBeenCalledTimes(2);

    await loadThemePreviews(themes, 'light');
    expect(getThemePreviewCacheSize()).toBe(4);
    expect(fetchThemePreviewColors).toHaveBeenCalledTimes(4);
  });

  test('returns fallback colors when fetch fails', async () => {
    const result = await loadThemePreviews([{ value: 'fail', label: 'Fail' }], 'dark');
    expect(result).toEqual([
      { id: 'fail', label: 'Fail', primary: '#6b7280', bg: '#111827' },
    ]);
  });
});
