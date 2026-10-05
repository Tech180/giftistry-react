import type { ListDisplaySearchScope } from '../interfaces/list-display-search-scope.interface';
import type { Item } from '../interfaces/item.interface';
import { getFriendlyCategoryLabel } from './category-label.util';

export function matchesListDisplaySearch(
  item: Item,
  searchQuery: string,
  searchScope: ListDisplaySearchScope
): boolean {
  const query = searchQuery.toLowerCase().trim();
  if (!query) {
    return true;
  }

  if (searchScope.name && item.Name.toLowerCase().includes(query)) {
    return true;
  }

  if (
    searchScope.description &&
    item.Description != null &&
    item.Description.toLowerCase().includes(query)
  ) {
    return true;
  }

  if (searchScope.category) {
    const categoryLabel =
      item.CategoryLabel ||
      getFriendlyCategoryLabel(item.Category || item.CategoryKey || '');
    if (categoryLabel.toLowerCase().includes(query)) {
      return true;
    }
  }

  if (searchScope.retailer) {
    const retailerMatch = item.Links.some((link) =>
      (link.RetailerName ?? '').toLowerCase().includes(query)
    );
    if (retailerMatch) {
      return true;
    }
  }

  return false;
}
