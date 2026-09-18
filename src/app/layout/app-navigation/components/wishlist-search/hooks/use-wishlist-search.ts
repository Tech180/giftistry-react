import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wishlistsApi, type Wishlist } from 'features/wishlists';
import type { UseWishlistSearchResult } from '../interfaces/use-wishlist-search-result.interface';

export function useWishlistSearch(): UseWishlistSearchResult {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current?.contains(e.target as Node) === false) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return;
      e.preventDefault();
      setIsSearchOpen(true);
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return;

    const fetchLists = async () => {
      setIsSearchLoading(true);
      try {
        const res = await wishlistsApi.listWishlists({ bucket: 'all' });
        setWishlists(Array.isArray(res) ? res : res.Wishlists ?? []);
      } catch {
        // fallback silently
      } finally {
        setIsSearchLoading(false);
      }
    };

    void fetchLists();
    setSearchQuery('');
    setActiveSearchIndex(0);
  }, [isSearchOpen]);

  const q = searchQuery.toLowerCase();
  const searchResults = wishlists.filter((w) => w.Title.toLowerCase().includes(q));
  const resultCount = searchResults.length;

  const handleSearchSelect = useCallback((wishlistId: string) => {
    setIsSearchOpen(false);
    navigate(`/wishlists/${wishlistId}`);
  }, [navigate]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSearchOpen(false);
        return;
      }
      if (!resultCount) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSearchIndex((prev) => (prev + 1) % resultCount);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSearchIndex((prev) => (prev - 1 + resultCount) % resultCount);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const id = searchResults[activeSearchIndex]?.Id;
        if (id) handleSearchSelect(id);
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => window.removeEventListener('keydown', handleModalKeyDown);
  }, [isSearchOpen, searchResults, resultCount, activeSearchIndex, handleSearchSelect]);

  return {
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
  };
}
