import type { Item } from '../interfaces/item.interface';
import { resolveItemFundingTarget } from './is-item-group-funding-active.util';

/** Positive display price used for sort and price filters. */
export function resolveListSortPrice(item: Item): number | null {
  const target = resolveItemFundingTarget(item);
  if (target > 0) {
    return target;
  }
  return null;
}
