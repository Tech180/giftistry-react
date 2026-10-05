import type { Item } from '../interfaces/item.interface';
import { getFriendlyCategoryLabel, normalizeCategoryLabel } from './category-label.util';

export interface CategoryFilterOption {
  key: string;
  label: string;
}

export function buildCategoryFilterOptions(items: Item[]): CategoryFilterOption[] {
  const map = new Map<string, string>();

  for (const item of items) {
    const key =
      item.CategoryKey ||
      normalizeCategoryLabel(item.Category?.trim() ? item.Category.trim() : 'uncategorized');
    const label =
      item.CategoryLabel ||
      (key === 'uncategorized'
        ? 'General Items'
        : getFriendlyCategoryLabel(item.Category || key));
    if (!map.has(key)) {
      map.set(key, label);
    }
  }

  return [...map.entries()]
    .map(([key, label]) => ({ key, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
