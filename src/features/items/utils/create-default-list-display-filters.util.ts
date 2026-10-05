import {
  LIST_DISPLAY_PRICE_RANGE_INCLUDE_NO_PRICE_DEFAULT,
  LIST_DISPLAY_PRICE_RANGE_MAX_DEFAULT,
  LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT,
} from '../constants/list-display-price-range.constant';
import type { ListDisplayFilters } from '../interfaces/list-display-filters.interface';

export function createDefaultListDisplayFilters(): ListDisplayFilters {
  return {
    availability: 'all',
    itemType: 'all',
    categories: [],
    addedByUserId: 'all',
    funding: 'all',
    priceMin: LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT,
    priceMax: LIST_DISPLAY_PRICE_RANGE_MAX_DEFAULT,
    includeNoPriceInRange: LIST_DISPLAY_PRICE_RANGE_INCLUDE_NO_PRICE_DEFAULT,
    pricePresence: 'all',
    partialQuantityRemaining: false,
    favoritesOnly: false,
    priorityOnly: false,
    hasLink: 'all',
    hasPhoto: 'all',
  };
}
