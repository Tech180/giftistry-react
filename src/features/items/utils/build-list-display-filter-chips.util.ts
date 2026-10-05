import {
  LIST_DISPLAY_PRICE_RANGE_MAX_DEFAULT,
  LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT,
} from '../constants/list-display-price-range.constant';
import { LIST_DISPLAY_SORT_LABELS } from '../constants/list-display-sort-options.constant';
import type { ListDisplayFilterChip } from '../interfaces/list-display-filter-chip.interface';
import type { ListDisplayFilterChipId } from '../interfaces/list-display-filter-chip-id.type';
import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import { isDefaultListDisplayPriceRange } from './is-default-list-display-price-range.util';

export function buildListDisplayFilterChips(
  preferences: ListDisplayPreferences,
  categoryLabels: Map<string, string>
): ListDisplayFilterChip[] {
  const chips: ListDisplayFilterChip[] = [];
  const { sort, filters } = preferences;

  if (sort !== 'default') {
    chips.push({ id: 'sort', label: LIST_DISPLAY_SORT_LABELS[sort] });
  }
  if (filters.availability !== 'all') {
    chips.push({
      id: 'availability',
      label: filters.availability === 'available' ? 'Open items' : 'Claimed items',
    });
  }
  if (filters.itemType === 'suggestion') {
    chips.push({ id: 'itemType', label: 'Suggestions only' });
  }
  if (filters.categories.length > 0) {
    const names = filters.categories
      .map((key) => categoryLabels.get(key) ?? key)
      .join(', ');
    chips.push({ id: 'categories', label: `Categories: ${names}` });
  }
  if (filters.addedByUserId !== 'all') {
    chips.push({
      id: 'addedBy',
      label: filters.addedByUserId === 'self' ? 'Added by you' : 'Added by filter',
    });
  }
  if (filters.funding !== 'all') {
    chips.push({ id: 'funding', label: 'Group funding filter' });
  }
  if (filters.favoritesOnly) {
    chips.push({ id: 'favoritesOnly', label: 'Favorites' });
  }
  if (filters.priorityOnly) {
    chips.push({ id: 'priorityOnly', label: 'Priority' });
  }
  if (filters.pricePresence !== 'all') {
    chips.push({
      id: 'pricePresence',
      label: filters.pricePresence === 'has' ? 'Has price' : 'No price',
    });
  }
  if (filters.partialQuantityRemaining) {
    chips.push({ id: 'partialQuantityRemaining', label: 'Partial quantity' });
  }
  if (filters.hasLink !== 'all') {
    chips.push({ id: 'hasLink', label: filters.hasLink === 'yes' ? 'Has link' : 'No link' });
  }
  if (filters.hasPhoto !== 'all') {
    chips.push({ id: 'hasPhoto', label: filters.hasPhoto === 'yes' ? 'Has photo' : 'No photo' });
  }
  if (!isDefaultListDisplayPriceRange(filters)) {
    chips.push({ id: 'priceRange', label: 'Price range' });
  }

  return chips;
}

export function clearListDisplayFilterChip(
  preferences: ListDisplayPreferences,
  chipId: ListDisplayFilterChipId
): ListDisplayPreferences {
  const next = structuredClone(preferences);
  switch (chipId) {
    case 'sort':
      next.sort = 'default';
      break;
    case 'availability':
      next.filters.availability = 'all';
      break;
    case 'itemType':
      next.filters.itemType = 'all';
      break;
    case 'categories':
      next.filters.categories = [];
      break;
    case 'addedBy':
      next.filters.addedByUserId = 'all';
      break;
    case 'funding':
      next.filters.funding = 'all';
      break;
    case 'favoritesOnly':
      next.filters.favoritesOnly = false;
      break;
    case 'priorityOnly':
      next.filters.priorityOnly = false;
      break;
    case 'pricePresence':
      next.filters.pricePresence = 'all';
      break;
    case 'partialQuantityRemaining':
      next.filters.partialQuantityRemaining = false;
      break;
    case 'hasLink':
      next.filters.hasLink = 'all';
      break;
    case 'hasPhoto':
      next.filters.hasPhoto = 'all';
      break;
    case 'priceRange':
      next.filters.priceMin = LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT;
      next.filters.priceMax = LIST_DISPLAY_PRICE_RANGE_MAX_DEFAULT;
      next.filters.includeNoPriceInRange = true;
      break;
    default:
      break;
  }
  return next;
}
