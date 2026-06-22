import { Laptop, Wallet, Home, Baby, Shirt, Sparkles, Compass, Book, Tag } from 'lucide-react';
import { CategoryMeta } from '../../interfaces/category-meta.interface';

export const CategoryDetails: Record<string, CategoryMeta> = {
  tech: { label: 'Tech', icon: Laptop, color: '#3b82f6' },
  'cash funds': { label: 'Cash Funds', icon: Wallet, color: '#10b981' },
  'kitchen utilities': { label: 'Kitchen Utilities', icon: Home, color: '#f59e0b' },
  kids: { label: 'Kids', icon: Baby, color: '#ec4899' },
  clothing: { label: 'Clothing', icon: Shirt, color: '#8b5cf6' },
  wellness: { label: 'Wellness', icon: Sparkles, color: '#14b8a6' },
  travel: { label: 'Travel', icon: Compass, color: '#06b6d4' },
  entertainment: { label: 'Entertainment', icon: Book, color: '#f43f5e' },
  uncategorized: { label: 'Uncategorized', icon: Tag, color: '#64748b' },
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
  
  // Custom categories get a hash-based color
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#06b6d4', '#f43f5e', '#6366f1'];
  const color = colors[Math.abs(hash) % colors.length];

  return {
    label,
    icon: Tag,
    color,
  };
};
