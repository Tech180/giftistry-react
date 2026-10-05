import {
  LIST_DISPLAY_CUSTOM_PRESETS_STORAGE_KEY,
  LIST_DISPLAY_MAX_CUSTOM_PRESETS,
  LIST_DISPLAY_PREFS_STORAGE_KEY,
} from '../constants/list-display-storage.constant';
import type { ListDisplayCustomPreset } from '../interfaces/list-display-custom-preset.interface';
import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import { createDefaultListDisplayPreferences } from './create-default-list-display-preferences.util';

type StoredPrefsMap = Record<string, ListDisplayPreferences>;

export function readListDisplayPrefsForList(listId: string): ListDisplayPreferences | null {
  try {
    const raw = localStorage.getItem(LIST_DISPLAY_PREFS_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as StoredPrefsMap;
    const entry = parsed[listId];
    if (!entry) {
      return null;
    }
    return {
      ...createDefaultListDisplayPreferences(),
      ...entry,
      filters: {
        ...createDefaultListDisplayPreferences().filters,
        ...entry.filters,
      },
      searchScope: {
        ...createDefaultListDisplayPreferences().searchScope,
        ...entry.searchScope,
      },
    };
  } catch {
    return null;
  }
}

export function writeListDisplayPrefsForList(
  listId: string,
  preferences: ListDisplayPreferences
): void {
  try {
    const raw = localStorage.getItem(LIST_DISPLAY_PREFS_STORAGE_KEY);
    const parsed: StoredPrefsMap = raw ? JSON.parse(raw) : {};
    parsed[listId] = preferences;
    localStorage.setItem(LIST_DISPLAY_PREFS_STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore quota / private mode
  }
}

export function readListDisplayCustomPresets(): ListDisplayCustomPreset[] {
  try {
    const raw = localStorage.getItem(LIST_DISPLAY_CUSTOM_PRESETS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ListDisplayCustomPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeListDisplayCustomPresets(presets: ListDisplayCustomPreset[]): void {
  try {
    const capped = presets.slice(0, LIST_DISPLAY_MAX_CUSTOM_PRESETS);
    localStorage.setItem(LIST_DISPLAY_CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // ignore
  }
}
