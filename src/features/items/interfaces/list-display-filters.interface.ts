import type { ListDisplayAvailabilityFilter } from './list-display-availability-filter.type';
import type { ListDisplayFundingFilter } from './list-display-funding-filter.type';
import type { ListDisplayItemTypeFilter } from './list-display-item-type-filter.type';
import type { ListDisplayPricePresenceFilter } from './list-display-price-presence-filter.type';
import type { ListDisplayTriStateFilter } from './list-display-tri-state-filter.type';

export interface ListDisplayFilters {
  availability: ListDisplayAvailabilityFilter;
  itemType: ListDisplayItemTypeFilter;
  categories: string[];
  addedByUserId: 'all' | 'self' | string;
  funding: ListDisplayFundingFilter;
  priceMin: string;
  priceMax: string;
  includeNoPriceInRange: boolean;
  pricePresence: ListDisplayPricePresenceFilter;
  partialQuantityRemaining: boolean;
  favoritesOnly: boolean;
  priorityOnly: boolean;
  hasLink: ListDisplayTriStateFilter;
  hasPhoto: ListDisplayTriStateFilter;
}
