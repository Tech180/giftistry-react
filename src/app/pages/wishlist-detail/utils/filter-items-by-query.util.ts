import type { Item } from 'features/items';

export function filterItemsByQuery(item: Item, searchQuery: string): boolean {
  const query = searchQuery.toLowerCase().trim();
  if (!query) {
    return true;
  }

  return (
    item.Name.toLowerCase().includes(query) ||
    (item.Description != null && item.Description.toLowerCase().includes(query))
  );
}
