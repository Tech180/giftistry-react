import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import { buildListDisplayFilterChips } from './build-list-display-filter-chips.util';

export function countActiveListDisplayFilters(
  preferences: ListDisplayPreferences,
  categoryLabels: Map<string, string> = new Map()
): number {
  return buildListDisplayFilterChips(preferences, categoryLabels).length;
}
