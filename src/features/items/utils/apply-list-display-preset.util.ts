import { LIST_DISPLAY_BUILT_IN_PRESETS } from '../constants/list-display-built-in-presets.constant';
import type { ListDisplayCustomPreset } from '../interfaces/list-display-custom-preset.interface';
import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import { createDefaultListDisplayPreferences } from './create-default-list-display-preferences.util';

export function applyListDisplayPreset(
  presetId: string,
  customPresets: ListDisplayCustomPreset[]
): ListDisplayPreferences | null {
  const builtIn = LIST_DISPLAY_BUILT_IN_PRESETS.find((preset) => preset.id === presetId);
  if (builtIn) {
    return structuredClone(builtIn.preferences);
  }

  if (presetId.startsWith('custom:')) {
    const id = presetId.slice('custom:'.length);
    const custom = customPresets.find((preset) => preset.id === id);
    if (custom) {
      return structuredClone(custom.preferences);
    }
  }

  return null;
}

export function mergeListDisplayPreferences(
  partial: Partial<ListDisplayPreferences>
): ListDisplayPreferences {
  const defaults = createDefaultListDisplayPreferences();
  return {
    sort: partial.sort ?? defaults.sort,
    filters: { ...defaults.filters, ...partial.filters },
    searchScope: { ...defaults.searchScope, ...partial.searchScope },
  };
}
