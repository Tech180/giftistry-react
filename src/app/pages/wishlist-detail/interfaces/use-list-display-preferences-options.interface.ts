import type { Item } from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';
import type { ListFilterContext } from 'features/items';

export interface UseListDisplayPreferencesOptions {
  listId: string | undefined;
  searchQuery: string;
  displayItems: Item[];
  itemGroups: ItemListGroup[] | null;
  filterContext: ListFilterContext;
}
