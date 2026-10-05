import type { ListDisplaySortKey } from '../interfaces/list-display-sort-key.type';
import type { Item } from '../interfaces/item.interface';
import { compareItemsForListSort } from './compare-items-for-list-sort.util';

export function sortItemsForListSort(
  items: Item[],
  sortKey: ListDisplaySortKey,
  allowGroupFunds: boolean
): Item[] {
  return [...items].sort((a, b) => compareItemsForListSort(a, b, sortKey, allowGroupFunds));
}
