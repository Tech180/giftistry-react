import React from 'react';
import { useWishlistSearch } from './hooks/use-wishlist-search';
import { WishlistSearchTemplate } from './wishlist-search.html';

export const WishlistSearch: React.FC = () => {
  const {
    searchRef,
    searchInputRef,
    searchQuery,
    isSearchOpen,
    isSearchLoading,
    searchResults,
    activeSearchIndex,
    setSearchQuery,
    setIsSearchOpen,
    setActiveSearchIndex,
    handleSearchSelect,
  } = useWishlistSearch();

  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
    setActiveSearchIndex(0);
  };

  return (
    <WishlistSearchTemplate
      searchRef={searchRef}
      searchInputRef={searchInputRef}
      searchQuery={searchQuery}
      isSearchOpen={isSearchOpen}
      isSearchLoading={isSearchLoading}
      results={searchResults.map((wishlist, idx) => ({
        wishlist,
        isActive: idx === activeSearchIndex,
        onSelect: () => handleSearchSelect(wishlist.Id),
        onHover: () => setActiveSearchIndex(idx),
      }))}
      onQueryChange={handleQueryChange}
      onFocus={() => setIsSearchOpen(true)}
      onClear={() => setSearchQuery('')}
    />
  );
};
