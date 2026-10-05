import { getItemFavoriteFlag } from 'shared/utils/parse-item-description.util';
import {
  isDefaultListDisplayPriceBounds,
  isDefaultListDisplayPriceRange,
} from './is-default-list-display-price-range.util';
import type { ListDisplayFilters } from '../interfaces/list-display-filters.interface';
import type { ListFilterContext } from '../interfaces/list-filter-context.interface';
import type { Item } from '../interfaces/item.interface';
import { hasPriorityValue } from './item-priority.util';
import { isListItemClaimedForFilter } from './resolve-list-availability.util';
import { resolveListFundingFilterState } from './resolve-list-funding-filter-state.util';
import { resolveListItemAddedByUserId } from './resolve-list-item-added-by-user-id.util';
import { resolveListItemType } from './resolve-list-item-type.util';
import { resolveListSortPrice } from './resolve-list-sort-price.util';

function matchesAddedBy(
  item: Item,
  addedByUserId: ListDisplayFilters['addedByUserId'],
  context: ListFilterContext
): boolean {
  if (addedByUserId === 'all') {
    return true;
  }

  const itemUserId = resolveListItemAddedByUserId(item, context.listOwnerUserId);
  if (addedByUserId === 'self') {
    return context.currentUserId != null && itemUserId === context.currentUserId;
  }

  return itemUserId === addedByUserId;
}

function matchesPriceRange(
  item: Item,
  filters: ListDisplayFilters
): boolean {
  if (isDefaultListDisplayPriceRange(filters)) {
    return true;
  }

  const price = resolveListSortPrice(item);

  if (isDefaultListDisplayPriceBounds(filters)) {
    if (price == null) {
      return false;
    }
    return true;
  }

  const minRaw = filters.priceMin.trim();
  const maxRaw = filters.priceMax.trim();
  const min = minRaw ? Number(minRaw) : null;
  const max = maxRaw ? Number(maxRaw) : null;

  if (price == null) {
    return filters.includeNoPriceInRange;
  }

  if (min != null && Number.isFinite(min) && price < min) {
    return false;
  }
  if (max != null && Number.isFinite(max) && price > max) {
    return false;
  }

  return true;
}

function matchesTriState(
  value: boolean,
  filter: ListDisplayFilters['hasLink']
): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'yes') {
    return value;
  }
  return !value;
}

export function matchesListDisplayFilters(
  item: Item,
  filters: ListDisplayFilters,
  context: ListFilterContext
): boolean {
  if (filters.availability === 'available' && isListItemClaimedForFilter(item, context.allowGroupFunds)) {
    return false;
  }
  if (filters.availability === 'claimed' && !isListItemClaimedForFilter(item, context.allowGroupFunds)) {
    return false;
  }

  if (filters.favoritesOnly && !getItemFavoriteFlag(item.Description, item.Metadata)) {
    return false;
  }

  if (filters.priorityOnly && !hasPriorityValue(item.Priority)) {
    return false;
  }

  if (filters.itemType !== 'all') {
    if (filters.itemType === 'suggestion' && !context.revealSuggestions && !context.canCollaborate) {
      return false;
    }
    if (resolveListItemType(item) !== filters.itemType) {
      return false;
    }
  }

  if (filters.categories.length > 0) {
    const key = item.CategoryKey || item.Category || '';
    if (!filters.categories.includes(key)) {
      return false;
    }
  }

  if (!matchesAddedBy(item, filters.addedByUserId, context)) {
    return false;
  }

  const fundingState = resolveListFundingFilterState(item, context.allowGroupFunds);
  if (filters.funding !== 'all' && fundingState !== filters.funding) {
    return false;
  }

  if (filters.pricePresence === 'has' && resolveListSortPrice(item) == null) {
    return false;
  }
  if (filters.pricePresence === 'no' && resolveListSortPrice(item) != null) {
    return false;
  }

  if (!matchesPriceRange(item, filters)) {
    return false;
  }

  if (filters.partialQuantityRemaining) {
    if (item.IsMultiCount !== true) {
      return false;
    }
    const desired = item.DesiredQuantity ?? 0;
    const remaining = item.RemainingQuantity ?? desired;
    if (!(remaining > 0 && remaining < desired)) {
      return false;
    }
  }

  const hasLink = item.Links.length > 0;
  if (!matchesTriState(hasLink, filters.hasLink)) {
    return false;
  }

  const hasPhoto = (item.Photos?.length ?? 0) > 0;
  if (!matchesTriState(hasPhoto, filters.hasPhoto)) {
    return false;
  }

  return true;
}
