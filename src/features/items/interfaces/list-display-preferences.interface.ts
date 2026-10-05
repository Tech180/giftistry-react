import type { ListDisplayFilters } from './list-display-filters.interface';
import type { ListDisplaySearchScope } from './list-display-search-scope.interface';
import type { ListDisplaySortKey } from './list-display-sort-key.type';

export interface ListDisplayPreferences {
  sort: ListDisplaySortKey;
  filters: ListDisplayFilters;
  searchScope: ListDisplaySearchScope;
}
