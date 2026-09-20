import { describe, expect, test } from 'vitest';
import {
  HOLIDAY_THEME_IDS,
  STANDARD_THEME_IDS,
} from '../constants/theme-catalog.constant';
import {
  getHolidayThemeIds,
  getHolidayThemes,
  getStandardThemeIds,
  getStandardThemes,
  getThemeLabel,
  getHolidayUnlockRules,
  isPresetThemeId,
} from './theme-catalog.util';

describe('theme-catalog.util', () => {
  test('splits standard and holiday catalogs', () => {
    expect(STANDARD_THEME_IDS).toContain('default');
    expect(STANDARD_THEME_IDS).not.toContain('halloween');
    expect(HOLIDAY_THEME_IDS).toContain('halloween');
    expect(getStandardThemeIds()).toEqual(STANDARD_THEME_IDS);
    expect(getHolidayThemeIds()).toEqual(HOLIDAY_THEME_IDS);
    expect(getHolidayThemes().every((t) => t.value && t.label)).toBe(true);
    expect(getStandardThemes().length).toBe(13);
    expect(getHolidayThemes().length).toBe(7);
  });

  test('isPresetThemeId accepts catalog IDs and rejects customs', () => {
    expect(isPresetThemeId('default')).toBe(true);
    expect(isPresetThemeId('halloween')).toBe(true);
    expect(isPresetThemeId('custom-123')).toBe(false);
  });

  test('getThemeLabel resolves catalog labels', () => {
    expect(getThemeLabel('default')).toBe('Linear');
    expect(getThemeLabel('independence')).toBe('4th of July');
    expect(getThemeLabel('unknown-custom')).toBe('unknown-custom');
  });

  test('holiday unlock rules include month and lastDay', () => {
    const halloween = getHolidayUnlockRules().find((rule) => rule.theme === 'halloween');
    expect(halloween).toEqual({ theme: 'halloween', month: 9, lastDay: 31 });
  });
});
