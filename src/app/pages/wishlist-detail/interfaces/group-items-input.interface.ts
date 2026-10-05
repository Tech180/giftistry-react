import type {
  Item,
  ListDisplayPreferences,
  ListFilterContext,
} from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';

export interface GroupItemsInput {
  visibleItems: Item[];
  searchQuery: string;
  itemGroups: ItemListGroup[] | null;
  enrichingItemIds: Set<string>;
  listDisplayPreferences?: ListDisplayPreferences;
  filterContext?: ListFilterContext;
}
