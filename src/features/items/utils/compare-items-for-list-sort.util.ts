import type { ListDisplaySortKey } from '../interfaces/list-display-sort-key.type';
import type { Item } from '../interfaces/item.interface';
import { compareItemsForListDisplay } from './compare-items-for-list-display.util';
import {
  resolveItemFundingSnapshot,
} from './is-item-group-funding-active.util';
import { resolveListSortPrice } from './resolve-list-sort-price.util';
import { isListItemClaimedForFilter } from './resolve-list-availability.util';

function tieBreakerDefault(a: Item, b: Item): number {
  return compareItemsForListDisplay(a, b);
}

function comparePriceNulls(a: number | null, b: number | null): number {
  if (a === null && b === null) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  return 0;
}

function compareFundingProgress(a: Item, b: Item, allowGroupFunds: boolean): number {
  const snapA = resolveItemFundingSnapshot(a);
  const snapB = resolveItemFundingSnapshot(b);
  const ratioA =
    snapA.fundingTarget > 0 ? snapA.totalClaimedAmount / snapA.fundingTarget : 0;
  const ratioB =
    snapB.fundingTarget > 0 ? snapB.totalClaimedAmount / snapB.fundingTarget : 0;
  if (ratioA !== ratioB) {
    return ratioB - ratioA;
  }
  return tieBreakerDefault(a, b);
}

function compareFundingRemaining(a: Item, b: Item): number {
  const snapA = resolveItemFundingSnapshot(a);
  const snapB = resolveItemFundingSnapshot(b);
  const leftA = Math.max(0, snapA.fundingTarget - snapA.totalClaimedAmount);
  const leftB = Math.max(0, snapB.fundingTarget - snapB.totalClaimedAmount);
  if (leftA !== leftB) {
    return leftA - leftB;
  }
  return tieBreakerDefault(a, b);
}

function parseCreatedAt(item: Item): number {
  if (!item.CreatedAt) {
    return 0;
  }
  const time = Date.parse(item.CreatedAt);
  return Number.isFinite(time) ? time : 0;
}

export function compareItemsForListSort(
  a: Item,
  b: Item,
  sortKey: ListDisplaySortKey,
  allowGroupFunds: boolean
): number {
  if (sortKey === 'default') {
    return compareItemsForListDisplay(a, b);
  }

  const pA = resolveListSortPrice(a);
  const pB = resolveListSortPrice(b);
  const claimedA = isListItemClaimedForFilter(a, allowGroupFunds);
  const claimedB = isListItemClaimedForFilter(b, allowGroupFunds);

  switch (sortKey) {
    case 'name-asc':
      return a.Name.localeCompare(b.Name) || tieBreakerDefault(a, b);
    case 'name-desc':
      return b.Name.localeCompare(a.Name) || tieBreakerDefault(a, b);
    case 'price-asc':
      return (
        comparePriceNulls(pA, pB) ||
        (pA != null && pB != null ? pA - pB : 0) ||
        tieBreakerDefault(a, b)
      );
    case 'price-desc':
      return (
        comparePriceNulls(pA, pB) ||
        (pA != null && pB != null ? pB - pA : 0) ||
        tieBreakerDefault(a, b)
      );
    case 'available-first':
      if (claimedA !== claimedB) {
        return claimedA ? 1 : -1;
      }
      return tieBreakerDefault(a, b);
    case 'claimed-first':
      if (claimedA !== claimedB) {
        return claimedA ? -1 : 1;
      }
      return tieBreakerDefault(a, b);
    case 'date-added-desc':
      return parseCreatedAt(b) - parseCreatedAt(a) || tieBreakerDefault(a, b);
    case 'date-added-asc':
      return parseCreatedAt(a) - parseCreatedAt(b) || tieBreakerDefault(a, b);
    case 'funding-progress-desc':
      return compareFundingProgress(a, b, allowGroupFunds);
    case 'funding-remaining-asc':
      return compareFundingRemaining(a, b);
    default:
      return tieBreakerDefault(a, b);
  }
}
