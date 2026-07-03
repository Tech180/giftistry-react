import { STANDARD_CATEGORIES } from '../constants/standard-categories';

export function getFriendlyCategoryLabel(id: string): string {
  const found = STANDARD_CATEGORIES.find((c) => c.id === id);
  if (found) return found.label;
  return id
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export { formatCategoryLabel } from 'shared/utils/category-label.util';
