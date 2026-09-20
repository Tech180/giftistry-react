import type { Item } from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';

export interface GroupItemsInput {
  visibleItems: Item[];
  searchQuery: string;
  itemGroups: ItemListGroup[] | null;
  enrichingItemIds: Set<string>;
}
