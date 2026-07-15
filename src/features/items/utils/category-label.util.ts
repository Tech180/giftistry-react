import { STANDARD_CATEGORIES } from '../constants/standard-categories';

/** Match BE `normalizeCategoryLabel` for grouping / canonical keys. */
export function normalizeCategoryLabel(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return 'uncategorized';
  return (
    trimmed
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_-]/g, '')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '') || 'uncategorized'
  );
}

export function getFriendlyCategoryLabel(id: string): string {
  const found = STANDARD_CATEGORIES.find((c) => c.id === id);
  if (found) return found.label;
  return id
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export { formatCategoryLabel } from 'shared/utils/category-label.util';
