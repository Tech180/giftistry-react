import { useState, useCallback } from 'react';
import { wishlistsApi } from '../api/wishlists.api';
import type { ListCounts } from '../interfaces/list-counts.interface';
import type { Wishlist } from '../interfaces/wishlist.interface';
import type { WishlistsPayload } from '../interfaces/wishlists-payload.interface';

function normalizeWishlistsPayload(data: unknown): {
  wishlists: Wishlist[];
  counts: ListCounts;
} {
  if (Array.isArray(data)) {
    return {
      wishlists: data as Wishlist[],
      counts: { My: 0, Shared: 0, Archive: 0 },
    };
  }
  if (data && typeof data === 'object') {
    const payload = data as WishlistsPayload;
    return {
      wishlists: payload.Wishlists ?? [],
      counts: payload.Counts ?? { My: 0, Shared: 0, Archive: 0 },
    };
  }
  return { wishlists: [], counts: { My: 0, Shared: 0, Archive: 0 } };
}

export function useWishlistController() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [counts, setCounts] = useState<ListCounts>({
    My: 0,
    Shared: 0,
    Archive: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlists = useCallback(
    async (params?: { bucket?: 'my' | 'shared' | 'archive' | 'all'; q?: string }) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await wishlistsApi.listWishlists(params);
        const normalized = normalizeWishlistsPayload(data);
        setWishlists(normalized.wishlists);
        setCounts(normalized.counts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wishlists.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createWishlist = async (
    title: string,
    expiresAt?: string | null,
    allowGroupFunds?: boolean,
    category?: string
  ) => {
    setError(null);
    try {
      const newList = await wishlistsApi.createWishlist(
        title,
        expiresAt,
        allowGroupFunds,
        category
      );
      setWishlists((prev) => [newList, ...prev]);
      return newList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wishlist.');
      throw err;
    }
  };

  const deactivateWishlist = async (listId: string) => {
    setError(null);
    try {
      await wishlistsApi.deactivateWishlist(listId);
      setWishlists((prev) => prev.filter((list) => list.Id !== listId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate wishlist.');
      throw err;
    }
  };

  const activateWishlist = async (listId: string) => {
    setError(null);
    try {
      await wishlistsApi.activateWishlist(listId);
      setWishlists((prev) =>
        prev.map((list) => (list.Id === listId ? { ...list, IsActive: true } : list))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate wishlist.');
      throw err;
    }
  };

  return {
    wishlists,
    counts,
    isLoading,
    error,
    fetchWishlists,
    createWishlist,
    deactivateWishlist,
    activateWishlist,
  };
}
