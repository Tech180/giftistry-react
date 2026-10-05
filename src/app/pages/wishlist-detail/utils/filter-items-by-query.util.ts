import type { Item } from 'features/items';
import { createDefaultListDisplaySearchScope, matchesListDisplaySearch } from 'features/items';

export function filterItemsByQuery(item: Item, searchQuery: string): boolean {
  return matchesListDisplaySearch(item, searchQuery, createDefaultListDisplaySearchScope());
}
