import { useState, useCallback } from 'react';
import { itemsApi } from '../api/items.api';
import { Item } from '../interfaces/item.interface';
import type { Claim } from '../interfaces/item-claim.interface';
import type { ClaimItemParams, ItemActions } from '../interfaces/item-actions.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { ItemClaimMutationProjection } from '../interfaces/claim-mutation-result.interface';
import type { ItemListGroup } from '../interfaces/item-list-result.interface';

function normalizeListPayload(data: unknown): { items: Item[]; groups: ItemListGroup[] | null } {
  if (Array.isArray(data)) {
    return { items: data as Item[], groups: null };
  }
  if (data && typeof data === 'object') {
    const payload = data as { Items?: Item[]; Groups?: ItemListGroup[] };
    return {
      items: payload.Items ?? [],
      groups: Array.isArray(payload.Groups) ? payload.Groups : null,
    };
  }
  return { items: [], groups: null };
}

export function useItemController() {
  const [items, setItems] = useState<Item[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemListGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const replaceItem = useCallback((updated: Item) => {
    setItems((prev) =>
      prev.map((item) =>
        item.Id === updated.Id
          ? {
              ...item,
              ...updated,
              Links: updated.Links ?? item.Links,
              Claims: updated.Claims ?? item.Claims,
            }
          : item
      )
    );
    setItemGroups((prev) => {
      if (!prev) return prev;
      return prev.map((group) => ({
        ...group,
        Items: group.Items.map((item) =>
          item.Id === updated.Id
            ? {
                ...item,
                ...updated,
                Links: updated.Links ?? item.Links,
                Claims: updated.Claims ?? item.Claims,
              }
            : item
        ),
      }));
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.Id !== itemId));
    setItemGroups((prev) => {
      if (!prev) return prev;
      return prev
        .map((group) => ({
          ...group,
          Items: group.Items.filter((item) => item.Id !== itemId),
        }))
        .filter((group) => group.Items.length > 0);
    });
  }, []);

  const applyClaimProjections = useCallback((projections: ItemClaimMutationProjection[]) => {
    if (projections.length === 0) {
      return;
    }
    const byId = new Map(projections.map((projection) => [projection.Id, projection]));
    const patch = (item: Item): Item => {
      const projection = byId.get(item.Id);
      if (!projection) {
        return item;
      }
      return {
        ...item,
        Claims: projection.Claims,
        IsClaimed: projection.IsClaimed,
        IsFullyClaimed: projection.IsFullyClaimed,
        IsMultiCount: projection.IsMultiCount,
        TotalClaimedAmount: projection.TotalClaimedAmount,
        TotalClaimedQuantity: projection.TotalClaimedQuantity,
        DesiredQuantity: projection.DesiredQuantity,
        RemainingQuantity: projection.RemainingQuantity,
        FundingTarget: projection.FundingTarget,
      };
    };
    setItems((prev) => prev.map(patch));
    setItemGroups((prev) => {
      if (!prev) return prev;
      return prev.map((group) => ({
        ...group,
        Items: group.Items.map(patch),
      }));
    });
  }, []);

  const fetchItems = useCallback(async (listId: string, options?: { silent?: boolean }) => {
    const silent = options?.silent === true;
    if (!silent) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await itemsApi.listItems(listId);
      const normalized = normalizeListPayload(data);
      setItems(normalized.items);
      setItemGroups(normalized.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items.');
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
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
      setItemGroups(null);
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

  const updateItem = async (
    itemId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    category?: string | null,
    priority?: number | null,
    sharedWithUserIds?: string[],
    linkUrl?: string | null,
    price?: number | null,
    websiteName?: string | null,
    metadata?: ItemDescriptionMetadata | null
  ) => {
    setError(null);
    try {
      const updated = await itemsApi.updateItem(
        itemId,
        name,
        description,
        priorityId,
        category,
        priority,
        sharedWithUserIds,
        linkUrl,
        price,
        websiteName,
        metadata
      );
      replaceItem(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item.');
      throw err;
    }
  };

  const claimItem = async ({
    itemId,
    amount,
    claimedByName,
    anonymous,
    quantity,
    selection,
    includeLinked,
  }: ClaimItemParams) => {
    setError(null);
    try {
      const result = await itemsApi.claimItem(
        itemId,
        amount,
        claimedByName,
        anonymous,
        quantity,
        selection,
        includeLinked
      );
      applyClaimProjections(result.Items ?? []);
      const newClaims = Array.isArray(result.Claims) ? result.Claims : [result.Claims];
      return includeLinked ? newClaims : newClaims[0];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim item.');
      throw err;
    }
  };

  const claimItems = async (requests: ClaimItemParams[]) => {
    if (requests.length === 1 && requests[0].includeLinked) {
      const result = await claimItem(requests[0]);
      return Array.isArray(result) ? result : [result];
    }
    const claims: Claim[] = [];
    for (const request of requests) {
      const result = await claimItem(request);
      if (Array.isArray(result)) {
        claims.push(...result);
      } else {
        claims.push(result);
      }
    }
    return claims;
  };

  const unclaimItem = async (itemId: string, _userId?: string | null) => {
    setError(null);
    try {
      const result = await itemsApi.unclaimItem(itemId);
      applyClaimProjections(result.Items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unclaim item.');
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    setError(null);
    try {
      await itemsApi.deleteItem(itemId);
      removeItem(itemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item.');
      throw err;
    }
  };

  const itemActions: ItemActions = {
    updateItem,
    addItemLink,
    claimItem,
    claimItems,
    unclaimItem,
    deleteItem,
  };

  return {
    items,
    itemGroups,
    isLoading,
    error,
    fetchItems,
    addItem,
    addItemLink,
    claimItem,
    claimItems,
    updateItem,
    unclaimItem,
    deleteItem,
    replaceItem,
    removeItem,
    itemActions,
  };
}
