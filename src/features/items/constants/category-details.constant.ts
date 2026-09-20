import { Laptop, Wallet, Home, Baby, Shirt, Sparkles, Compass, Book, Tag } from 'lucide-react';
import type { CategoryMeta } from '../interfaces/category-meta.interface';

export const CATEGORY_DETAILS: Record<string, CategoryMeta> = {
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
