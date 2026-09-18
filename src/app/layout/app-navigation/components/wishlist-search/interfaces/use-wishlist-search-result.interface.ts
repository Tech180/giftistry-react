import type { RefObject } from 'react';
import type { Wishlist } from 'features/wishlists';

export interface UseWishlistSearchResult {
  searchRef: RefObject<HTMLDivElement | null>;
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  isSearchOpen: boolean;
  isSearchLoading: boolean;
  searchResults: Wishlist[];
  activeSearchIndex: number;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setActiveSearchIndex: (index: number) => void;
  handleSearchSelect: (wishlistId: string) => void;
}
