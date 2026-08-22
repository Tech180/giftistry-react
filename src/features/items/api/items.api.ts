import { apiClient } from 'core/api/client';
import { ItemLink } from '../interfaces/item-link.interface';
import { Claim } from '../interfaces/item-claim.interface';
import { Item } from '../interfaces/item.interface';
import type { ItemListResult } from '../interfaces/item-list-result.interface';
import { FieldDefinition } from '../interfaces/field-definition.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type {
  ClaimItemResult,
  UnclaimItemResult,
} from '../interfaces/claim-mutation-result.interface';

export type {
  ExtractMetadataCustomFields,
  ExtractMetadataDiagnostics,
  ExtractMetadataResult,
} from '../interfaces/extract-metadata-result.interface';

export const itemsApi = {
  listItems: (listId: string) =>
    apiClient.get<ItemListResult | Item[]>(`/api/wishlists/${listId}/items`),

  addItem: (
    listId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    isHiddenIdea?: boolean,
    linkUrl?: string | null,
    price?: number | null,
    websiteName?: string | null,
    category?: string | null,
    priority?: number | null,
    sharedWithUserIds?: string[],
    metadata?: ItemDescriptionMetadata | null
  ) =>
    apiClient.post<Item>(
      `/api/wishlists/${listId}/items`,
      {
        Name: name,
        Description: description,
        PriorityId: priorityId,
        IsHiddenIdea: isHiddenIdea,
        LinkUrl: linkUrl,
        Price: price,
        WebsiteName: websiteName,
        Category: category,
        Priority: priority,
        SharedWithUserIds: sharedWithUserIds,
        Metadata: metadata,
      },
      'Items'
    ),

  addItemLink: (itemId: string, url: string) =>
    apiClient.post<ItemLink>(
      `/api/items/${itemId}/links`,
      { Url: url },
      'Items'
    ),

  syncItemLinks: (itemId: string, targetItemIds: string[]) =>
    apiClient.post<void>(
      `/api/items/${itemId}/links/sync`,
      { TargetItemIds: targetItemIds },
      'Items'
    ),

  syncItemRelated: (itemId: string, targetItemIds: string[]) =>
    apiClient.post<void>(
      `/api/items/${itemId}/related/sync`,
      { TargetItemIds: targetItemIds },
      'Items'
    ),

  claimItem: (
    itemId: string,
    amount?: number | null,
    claimedByName?: string | null,
    anonymous?: boolean,
    quantity?: number,
    selection?: string | null,
    includeLinked?: boolean
  ) =>
    apiClient.post<ClaimItemResult>(
      `/api/items/${itemId}/claims`,
      {
        Amount: amount,
        ClaimedByName: claimedByName,
        Anonymous: anonymous,
        Quantity: quantity,
        Selection: selection,
        IncludeLinked: includeLinked,
      },
      'Items'
    ),

  unclaimItem: (itemId: string) =>
    apiClient.delete<UnclaimItemResult>(`/api/items/${itemId}/claims`),

  updateItem: (
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
  ) =>
    apiClient.put<Item>(
      `/api/items/${itemId}`,
      {
        Name: name,
        Description: description,
        PriorityId: priorityId,
        Category: category,
        Priority: priority,
        SharedWithUserIds: sharedWithUserIds,
        LinkUrl: linkUrl,
        Price: price,
        WebsiteName: websiteName,
        Metadata: metadata,
        ...(isHiddenIdea !== undefined ? { IsHiddenIdea: isHiddenIdea } : {}),
      },
      'Items'
    ),

  deleteItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}`),

  // Future: AI item reviews — keep client; frontend does not call until the feature ships.
  getItemReviews: (itemId: string) =>
    apiClient.get<{ Summary: string; Pros: string[]; Cons: string[]; Reviews: string[] } | null>(`/api/items/${itemId}/reviews`),

  getFieldDefinitions: (category: string) =>
    apiClient.get<FieldDefinition[]>(`/api/items/field-definitions?category=${category}`),
};
export type { ItemLink, Claim, Item, FieldDefinition };
