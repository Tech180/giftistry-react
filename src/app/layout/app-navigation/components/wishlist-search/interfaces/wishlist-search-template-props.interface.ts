import type { RefObject } from 'react';
import type { WishlistSearchResultItem } from './wishlist-search-result-item.interface';

export interface WishlistSearchTemplateProps {
  searchRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  isSearchOpen: boolean;
  isSearchLoading: boolean;
  results: WishlistSearchResultItem[];
  onQueryChange: (query: string) => void;
  onFocus: () => void;
  onClear: () => void;
}
