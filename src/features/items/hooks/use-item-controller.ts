import { useState, useCallback } from 'react';
import { itemsApi } from '../api/items.api';
import { Item } from '../interfaces/item.interface';
import type { Claim } from '../interfaces/item-claim.interface';
import type { ClaimItemParams, ItemActions } from '../interfaces/item-actions.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { ItemClaimMutationProjection } from '../interfaces/claim-mutation-result.interface';
import type { ItemListGroup } from '../interfaces/item-list-result.interface';
import type {
  CreateSubstitutionPayload,
  ItemSubstitutionOption,
  ItemSubstitutionSummary,
} from '../interfaces/item-substitution.interface';

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

function applyProjectionToItem(
  item: Item,
  projection: ItemClaimMutationProjection
): Item {
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
}

function applyProjectionToSubstitutionSummary(
  child: ItemSubstitutionSummary,
  projection: ItemClaimMutationProjection
): ItemSubstitutionSummary {
  return {
    ...child,
    Claims: projection.Claims,
    IsClaimed: projection.IsClaimed,
    IsFullyClaimed: projection.IsFullyClaimed,
    MultiCount: projection.IsMultiCount ?? child.MultiCount,
    TotalClaimedAmount: projection.TotalClaimedAmount,
    TotalClaimedQuantity: projection.TotalClaimedQuantity,
    DesiredQuantity: projection.DesiredQuantity ?? child.DesiredQuantity,
    RemainingQuantity: projection.RemainingQuantity,
    FundingTarget: projection.FundingTarget,
  };
}

function sumClaimedAmount(claims: Claim[]): number {
  return claims.reduce((sum, claim) => sum + (claim.Amount || 0), 0);
}

/** Patch parent and nested substitution claim state after claim/unclaim. */
function patchItemWithClaimProjections(
  item: Item,
  byId: Map<string, ItemClaimMutationProjection>
): Item {
  let next = item;
  const parentProjection = byId.get(item.Id);
  if (parentProjection) {
    next = applyProjectionToItem(next, parentProjection);
  }

  const options = next.SubstitutionOptions;
  if (!options?.length) {
    return next;
  }

  let optionsChanged = false;
  const patchedOptions = options.map((option) => {
    const childProjection = byId.get(option.Item.Id);
    if (!childProjection) {
      return option;
    }
    optionsChanged = true;
    return {
      ...option,
      Item: applyProjectionToSubstitutionSummary(option.Item, childProjection),
    };
  });

  if (!optionsChanged && !parentProjection) {
    return next;
  }

  const claimedUserIds = new Set<string>();
  for (const projection of byId.values()) {
    for (const claim of projection.Claims) {
      if (claim.UserId) claimedUserIds.add(claim.UserId);
    }
  }

  const clearSiblingClaims = (claims: Claim[], itemId: string): Claim[] => {
    if (!byId.has(itemId) && claimedUserIds.size > 0) {
      return claims.filter((c) => !c.UserId || !claimedUserIds.has(c.UserId));
    }
    return claims;
  };

  if (claimedUserIds.size > 0) {
    if (!parentProjection) {
      const cleared = clearSiblingClaims(next.Claims ?? [], next.Id);
      if (cleared !== next.Claims) {
        next = {
          ...next,
          Claims: cleared,
          IsClaimed: cleared.length > 0,
          TotalClaimedAmount: sumClaimedAmount(cleared),
        };
      }
    }

    const withClearedSiblings = patchedOptions.map((option) => {
      if (byId.has(option.Item.Id)) {
        return option;
      }
      const cleared = clearSiblingClaims(option.Item.Claims ?? [], option.Item.Id);
      if (cleared === option.Item.Claims) {
        return option;
      }
      return {
        ...option,
        Item: {
          ...option.Item,
          Claims: cleared,
          IsClaimed: cleared.length > 0,
          TotalClaimedAmount: sumClaimedAmount(cleared),
        },
      };
    });

    return {
      ...next,
      SubstitutionOptions: withClearedSiblings,
      ActiveSubstitutionId:
        [...byId.keys()].find((id) =>
          withClearedSiblings.some((o) => o.Item.Id === id)
        ) ?? (parentProjection ? next.Id : next.ActiveSubstitutionId),
    };
  }

  return {
    ...next,
    SubstitutionOptions: optionsChanged ? patchedOptions : options,
  };
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
              SubstitutionOptions:
                updated.SubstitutionOptions ?? item.SubstitutionOptions,
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
                SubstitutionOptions:
                  updated.SubstitutionOptions ?? item.SubstitutionOptions,
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

  const patchSubstitutionOptions = useCallback(
    (
      parentItemId: string,
      options: ItemSubstitutionOption[],
      allowSubstitutions?: boolean
    ) => {
      const patch = (item: Item): Item => {
        if (item.Id !== parentItemId) return item;
        return {
          ...item,
          SubstitutionOptions: options,
          ...(allowSubstitutions !== undefined
            ? { AllowSubstitutions: allowSubstitutions }
            : {}),
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
    },
    []
  );

  const refreshSubstitutions = useCallback(
    async (parentItemId: string) => {
      const result = await itemsApi.listSubstitutions(parentItemId);
      patchSubstitutionOptions(parentItemId, result.Options, result.AllowSubstitutions);
      return result;
    },
    [patchSubstitutionOptions]
  );

  const applyClaimProjections = useCallback((projections: ItemClaimMutationProjection[]) => {
    if (projections.length === 0) {
      return;
    }
    const byId = new Map(projections.map((projection) => [projection.Id, projection]));
    const patch = (item: Item): Item => patchItemWithClaimProjections(item, byId);
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
    metadata?: ItemDescriptionMetadata | null,
    isHiddenIdea?: boolean
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
        metadata,
        isHiddenIdea
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

  const unclaimItem = async (
    itemId: string,
    _userId?: string | null,
    includeLinked?: boolean
  ) => {
    setError(null);
    try {
      const result = await itemsApi.unclaimItem(itemId, includeLinked);
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

  const createOwnerSubstitution = async (
    parentItemId: string,
    payload: CreateSubstitutionPayload
  ) => {
    setError(null);
    try {
      const option = await itemsApi.createOwnerSubstitution(parentItemId, payload);
      await refreshSubstitutions(parentItemId);
      return option;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create substitution.');
      throw err;
    }
  };

  const createClaimerSubstitution = async (
    parentItemId: string,
    payload: CreateSubstitutionPayload
  ) => {
    setError(null);
    try {
      const option = await itemsApi.createClaimerSubstitution(parentItemId, payload);
      await refreshSubstitutions(parentItemId);
      return option;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create substitution.');
      throw err;
    }
  };

  const updateSubstitution = async (
    parentItemId: string,
    substitutionId: string,
    payload: CreateSubstitutionPayload
  ) => {
    setError(null);
    try {
      const option = await itemsApi.updateSubstitution(substitutionId, payload);
      await refreshSubstitutions(parentItemId);
      return option;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update substitution.');
      throw err;
    }
  };

  const deleteSubstitution = async (parentItemId: string, substitutionId: string) => {
    setError(null);
    try {
      await itemsApi.deleteSubstitution(substitutionId);
      await refreshSubstitutions(parentItemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete substitution.');
      throw err;
    }
  };

  const reorderOwnerSubstitutions = async (
    parentItemId: string,
    orderedIds: string[]
  ) => {
    setError(null);
    try {
      await itemsApi.reorderOwnerSubstitutions(parentItemId, orderedIds);
      await refreshSubstitutions(parentItemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder substitutions.');
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
    createOwnerSubstitution,
    createClaimerSubstitution,
    updateSubstitution,
    deleteSubstitution,
    reorderOwnerSubstitutions,
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
    patchSubstitutionOptions,
    refreshSubstitutions,
    createOwnerSubstitution,
    createClaimerSubstitution,
    updateSubstitution,
    deleteSubstitution,
    reorderOwnerSubstitutions,
    itemActions,
  };
}
