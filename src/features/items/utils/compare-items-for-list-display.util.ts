import type { Item } from '../interfaces/item.interface';
import { hasPriorityValue } from './item-priority.util';
import { resolveItemListDisplayTier } from './resolve-item-list-display-tier.util';

function comparePriorityValues(
  a: number | null | undefined,
  b: number | null | undefined
): number {
  const aHas = hasPriorityValue(a);
  const bHas = hasPriorityValue(b);
  if (aHas && bHas) {
    if (a !== b) {
      return a - b;
    }
    return 0;
  }
  if (aHas && !bHas) {
    return -1;
  }
  if (!aHas && bHas) {
    return 1;
  }
  return 0;
}

export function compareItemsForListDisplay(a: Item, b: Item): number {
  const tierCompare = resolveItemListDisplayTier(a) - resolveItemListDisplayTier(b);
  if (tierCompare !== 0) {
    return tierCompare;
  }

  const priorityCompare = comparePriorityValues(a.Priority, b.Priority);
  if (priorityCompare !== 0) {
    return priorityCompare;
  }

  const nameCompare = a.Name.localeCompare(b.Name);
  if (nameCompare !== 0) {
    return nameCompare;
  }

  return a.Id.localeCompare(b.Id);
}
