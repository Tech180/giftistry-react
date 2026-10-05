import { LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT } from '../constants/list-display-price-range.constant';
import type { ListDisplayPreferences } from '../interfaces/list-display-preferences.interface';
import type { ListFilterCapabilities } from '../interfaces/list-filter-capabilities.interface';
import { createDefaultListDisplayFilters } from './create-default-list-display-filters.util';
import { createDefaultListDisplaySearchScope } from './create-default-list-display-search-scope.util';
import { createDefaultListDisplayPreferences } from './create-default-list-display-preferences.util';

function sanitizePriceMinField(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT;
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) {
    return LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT;
  }
  return String(Math.floor(num));
}

function normalizeLegacyDefaultPriceRange(filters: {
  priceMin: string;
  priceMax: string;
}): void {
  if (filters.priceMin.trim() === '0' && !filters.priceMax.trim()) {
    filters.priceMin = LIST_DISPLAY_PRICE_RANGE_MIN_DEFAULT;
  }
}

function sanitizePriceMaxField(raw: string): string {
  const trimmed = String(raw ?? '').trim();
  if (!trimmed) {
    return '';
  }
  const num = Number(trimmed);
  if (!Number.isFinite(num) || num < 0) {
    return '';
  }
  return String(Math.floor(num));
}

export function sanitizeListDisplayPreferences(
  preferences: ListDisplayPreferences,
  capabilities: ListFilterCapabilities,
  validCategoryKeys?: Set<string>
): ListDisplayPreferences {
  const defaults = createDefaultListDisplayPreferences();
  const baseFilters = { ...defaults.filters, ...preferences.filters };

  let categories = baseFilters.categories;
  if (validCategoryKeys) {
    categories = categories.filter((key) => validCategoryKeys.has(key));
  }

  const filters = {
    ...createDefaultListDisplayFilters(),
    ...baseFilters,
    categories,
    priceMin: sanitizePriceMinField(baseFilters.priceMin),
    priceMax: sanitizePriceMaxField(baseFilters.priceMax),
  };

  normalizeLegacyDefaultPriceRange(filters);

  if (!capabilities.showAvailabilityFilter) {
    filters.availability = 'all';
  }
  if (!capabilities.showAddedBy) {
    filters.addedByUserId = 'all';
  }
  if (!capabilities.showGroupFunding) {
    filters.funding = 'all';
  }
  if (!capabilities.showFavorites) {
    filters.favoritesOnly = false;
  }
  if (!capabilities.showPricePresence) {
    filters.pricePresence = 'all';
  }
  if (!capabilities.showPartialQuantity) {
    filters.partialQuantityRemaining = false;
  }
  if (!capabilities.showEnrichFilters) {
    filters.hasLink = 'all';
    filters.hasPhoto = 'all';
  }
  if (!capabilities.showSuggestionsType && filters.itemType === 'suggestion') {
    filters.itemType = 'all';
  }
  if (filters.itemType === 'product' || filters.itemType === 'idea') {
    filters.itemType = 'all';
  }

  return {
    sort: preferences.sort ?? defaults.sort,
    filters,
    searchScope: createDefaultListDisplaySearchScope(),
  };
}
