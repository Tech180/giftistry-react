import type { ListDisplayFilters } from '../interfaces/list-display-filters.interface';
import type { ListDisplaySearchScope } from '../interfaces/list-display-search-scope.interface';
import type { ListFilterContext } from '../interfaces/list-filter-context.interface';
import type { Item } from '../interfaces/item.interface';
import { matchesListDisplayFilters } from './matches-list-display-filters.util';
import { matchesListDisplaySearch } from './matches-list-display-search.util';

export function filterItemsForListDisplay(input: {
  items: Item[];
  searchQuery: string;
  searchScope: ListDisplaySearchScope;
  filters: ListDisplayFilters;
  context: ListFilterContext;
}): Item[] {
  const { items, searchQuery, searchScope, filters, context } = input;
  return items.filter(
    (item) =>
      matchesListDisplaySearch(item, searchQuery, searchScope) &&
      matchesListDisplayFilters(item, filters, context)
  );
}
