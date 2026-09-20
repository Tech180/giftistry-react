import { Tag } from 'lucide-react';
import { CATEGORY_DETAILS } from '../constants/category-details.constant';
import type { CategoryMeta } from '../interfaces/category-meta.interface';
import { getFriendlyCategoryLabel } from './category-label.util';

export function getCategoryMeta(category: string | null | undefined): CategoryMeta {
  const key = (category || 'uncategorized').trim().toLowerCase();
  if (CATEGORY_DETAILS[key]) {
    return CATEGORY_DETAILS[key];
  }
  const label = category ? getFriendlyCategoryLabel(category) : 'Uncategorized';
  return {
    label,
    icon: Tag,
  };
}
