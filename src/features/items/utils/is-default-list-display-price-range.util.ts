import type { ListDisplayFilters } from '../interfaces/list-display-filters.interface';

/** Open bounds: no min (–) and no max (∞) in the UI. */
export function isDefaultListDisplayPriceBounds(
  filters: Pick<ListDisplayFilters, 'priceMin' | 'priceMax'>
): boolean {
  const min = filters.priceMin.trim();
  const max = filters.priceMax.trim();
  return (min === '' || min === '0') && max === '';
}

/** Full default price range: – to ∞ and include items with no price. */
export function isDefaultListDisplayPriceRange(
  filters: Pick<ListDisplayFilters, 'priceMin' | 'priceMax' | 'includeNoPriceInRange'>
): boolean {
  return isDefaultListDisplayPriceBounds(filters) && filters.includeNoPriceInRange;
}
