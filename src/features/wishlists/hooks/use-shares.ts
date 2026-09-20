import { useEffect, useState } from 'react';
import { wishlistsApi } from '../api/wishlists.api';
import type { ListShare } from '../interfaces/list-share.interface';

export function useShares(listId: string) {
  const [shares, setShares] = useState<ListShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShares = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await wishlistsApi.listShares(listId);
      setShares(result || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load shares.';
      setError(message);
      console.error('Failed to load shares:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadShares();
    // Mount / listId: loadShares closes over listId + setState only.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [listId]);

  return { shares, isLoading, error, setError, loadShares };
}
