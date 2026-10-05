import type { Item } from '../interfaces/item.interface';
import { compareItemsForListDisplay } from './compare-items-for-list-display.util';

export function sortItemsForListDisplay(items: Item[]): Item[] {
  return [...items].sort(compareItemsForListDisplay);
}
