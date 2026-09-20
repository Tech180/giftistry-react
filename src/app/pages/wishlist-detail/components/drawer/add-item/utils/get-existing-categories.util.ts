import type { Item } from 'features/items';
import { UNCATEGORIZED_CATEGORY_KEY } from '../../../../constants/category-group.constant';

export function getExistingCategories(items: Item[]): string[] {
  return Array.from(
    new Set(
      items
        .map((item) => item.Category?.trim())
        .filter((cat): cat is string => !!cat && cat !== UNCATEGORIZED_CATEGORY_KEY)
    )
  );
}
