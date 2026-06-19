import { Laptop, Wallet, Home, Baby, Shirt, Sparkles, Compass, Book, Tag } from 'lucide-react';

import { CategoryMeta } from '../../interfaces/category-meta.interface';

export const CategoryDetails: Record<string, CategoryMeta> = {
  tech: { label: 'Tech', icon: Laptop },
  'cash funds': { label: 'Cash Funds', icon: Wallet },
  'kitchen utilities': { label: 'Kitchen Utilities', icon: Home },
  kids: { label: 'Kids', icon: Baby },
  clothing: { label: 'Clothing', icon: Shirt },
  wellness: { label: 'Wellness', icon: Sparkles },
  travel: { label: 'Travel', icon: Compass },
  entertainment: { label: 'Entertainment', icon: Book },
  uncategorized: { label: 'Uncategorized', icon: Tag },
};

export const getCategoryMeta = (category: string | null | undefined): CategoryMeta => {
  const key = (category || 'uncategorized').trim().toLowerCase();
  if (CategoryDetails[key]) {
    return CategoryDetails[key];
  }
  // For custom categories, use the title-cased value and fallback to Tag icon
  const label = category
    ? category.trim().charAt(0).toUpperCase() + category.trim().slice(1)
    : 'Uncategorized';
  return {
    label,
    icon: Tag,
  };
};
