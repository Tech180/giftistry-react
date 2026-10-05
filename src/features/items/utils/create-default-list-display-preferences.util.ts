import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import { createDefaultListDisplayFilters } from './create-default-list-display-filters.util';
import { createDefaultListDisplaySearchScope } from './create-default-list-display-search-scope.util';

export function createDefaultListDisplayPreferences(): ListDisplayPreferences {
  return {
    sort: 'default',
    filters: createDefaultListDisplayFilters(),
    searchScope: createDefaultListDisplaySearchScope(),
  };
}
