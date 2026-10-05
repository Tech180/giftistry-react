import type { ListDisplayItemTypeFilter } from '../interfaces/list-display-item-type-filter.type';
import type { Item } from '../interfaces/item.interface';
import { resolveListSortPrice } from './resolve-list-sort-price.util';

export function resolveListItemType(item: Item): Exclude<ListDisplayItemTypeFilter, 'all'> {
  if (item.IsSuggestion) {
    return 'suggestion';
  }
  if (resolveListSortPrice(item) != null) {
    return 'product';
  }
  return 'idea';
}
