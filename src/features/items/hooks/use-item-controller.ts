import { useState, useCallback } from 'react';
import { itemsApi } from '../api/items.api';
import { Item } from '../interfaces/item.interface';

export function useItemController() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (listId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await itemsApi.listItems(listId);
      setItems(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = async (
    listId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    isHiddenIdea?: boolean
  ) => {
    setError(null);
    try {
      const newItem = await itemsApi.addItem(listId, name, description, priorityId, isHiddenIdea);
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item.');
      throw err;
    }
  };

  const addItemLink = async (itemId: string, url: string) => {
    setError(null);
    try {
      const newLink = await itemsApi.addItemLink(itemId, url);
      setItems((prev) =>
        prev.map((item) => {
          if (item.Id === itemId) {
            return {
              ...item,
              Links: [...item.Links, newLink],
            };
          }
          return item;
        })
      );
      return newLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add link.');
      throw err;
    }
  };

  const claimItem = async (itemId: string, amount?: number | null, claimedByName?: string | null) => {
    setError(null);
    try {
      const newClaim = await itemsApi.claimItem(itemId, amount, claimedByName);
      setItems((prev) =>
        prev.map((item) => {
          if (item.Id === itemId) {
            return {
              ...item,
              Claims: [...item.Claims, newClaim],
              IsClaimed: true,
            };
          }
          return item;
        })
      );
      return newClaim;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim item.');
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    fetchItems,
    addItem,
    addItemLink,
    claimItem,
  };
}
