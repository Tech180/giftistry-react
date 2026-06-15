import { useState, useCallback } from 'react';
import { wishlistsApi } from '../api/wishlists.api';
import { Wishlist } from '../interfaces/wishlist.interface';

export function useWishlistController() {
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlists = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await wishlistsApi.listWishlists();
      setWishlists(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlists.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createWishlist = async (title: string, expiresAt?: string | null, allowGroupFunds?: boolean) => {
    setError(null);
    try {
      const newList = await wishlistsApi.createWishlist(title, expiresAt, allowGroupFunds);
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

  return {
    wishlists,
    isLoading,
    error,
    fetchWishlists,
    createWishlist,
    deactivateWishlist,
  };
}
