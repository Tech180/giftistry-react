import {
  HOLIDAY_THEME_IDS,
  STANDARD_THEME_IDS,
  THEME_CATALOG,
  THEME_IDS,
} from '../constants/theme-catalog.constant';
import type { ThemeCatalogEntry } from '../interfaces/theme-catalog-entry.interface';
import type { ThemePickerOption } from '../interfaces/theme-picker-option.interface';

export function toThemePickerOption(entry: ThemeCatalogEntry): ThemePickerOption {
  return { value: entry.id, label: entry.label };
}

export function getStandardThemeEntries(): ThemeCatalogEntry[] {
  return THEME_CATALOG.filter((entry) => entry.category === 'standard');
}

export function getHolidayThemeEntries(): ThemeCatalogEntry[] {
  return THEME_CATALOG.filter((entry) => entry.category === 'holiday');
}

export function getStandardThemes(): ThemePickerOption[] {
  return getStandardThemeEntries().map(toThemePickerOption);
}

export function getHolidayThemes(): ThemePickerOption[] {
  return getHolidayThemeEntries().map(toThemePickerOption);
}

export function getAllPresetThemes(): ThemePickerOption[] {
  return THEME_CATALOG.map(toThemePickerOption);
}

export function getStandardThemeIds(): readonly string[] {
  return STANDARD_THEME_IDS;
}

export function getHolidayThemeIds(): readonly string[] {
  return HOLIDAY_THEME_IDS;
}

export function isPresetThemeId(themeId: string): boolean {
  return (THEME_IDS as readonly string[]).includes(themeId);
}

export function getThemeLabel(themeId: string): string {
  const entry = THEME_CATALOG.find((theme) => theme.id === themeId);
  return entry?.label ?? themeId;
}

export function getHolidayUnlockRules(): {
  theme: string;
  month: number;
  lastDay: number;
}[] {
  return getHolidayThemeEntries()
    .filter(
      (entry): entry is ThemeCatalogEntry & { unlockMonth: number; unlockLastDay: number } =>
        entry.unlockMonth !== undefined && entry.unlockLastDay !== undefined,
    )
    .map((entry) => ({
      theme: entry.id,
      month: entry.unlockMonth,
      lastDay: entry.unlockLastDay,
    }));
}
