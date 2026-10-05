import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import type { ListFilterContext } from '../interfaces/list-filter-context.interface';
import type { Item } from '../interfaces/item.interface';
import { filterItemsForListDisplay } from './filter-items-for-list-display.util';

export function countMatchingListDisplayItems(input: {
  items: Item[];
  searchQuery: string;
  preferences: ListDisplayPreferences;
  context: ListFilterContext;
}): number {
  return filterItemsForListDisplay({
    items: input.items,
    searchQuery: input.searchQuery,
    searchScope: input.preferences.searchScope,
    filters: input.preferences.filters,
    context: input.context,
  }).length;
}
