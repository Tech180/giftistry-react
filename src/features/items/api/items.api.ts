import { apiClient } from 'core/api/client';
import { ItemLink } from '../interfaces/item-link.interface';
import { Claim } from '../interfaces/item-claim.interface';
import { Item } from '../interfaces/item.interface';
import { FieldDefinition } from '../interfaces/field-definition.interface';

export const itemsApi = {
  listItems: (listId: string) =>
    apiClient.get<Item[]>(`/api/wishlists/${listId}/items`),

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
    sharedWithUserIds?: string[]
  ) =>
    apiClient.post<Item>(
      `/api/wishlists/${listId}/items`,
      { name, description, priorityId, isHiddenIdea, linkUrl, price, websiteName, category, priority, sharedWithUserIds },
      'Items'
    ),

  extractMetadata: (url: string) =>
    apiClient.post<{
      title: string;
      price: number | null;
      description?: string | null;
      color?: string | null;
      size?: string | null;
      category?: string | null;
      }>(
      `/api/items/extract-metadata`,
      { url },
      'Items'
    ),

  addItemLink: (itemId: string, url: string) =>
    apiClient.post<ItemLink>(
      `/api/items/${itemId}/links`,
      { url },
      'Items'
    ),

  claimItem: (
    itemId: string,
    amount?: number | null,
    claimedByName?: string | null,
    anonymous?: boolean,
    quantity?: number,
    selection?: string | null
  ) =>
    apiClient.post<Claim>(
      `/api/items/${itemId}/claims`,
      { amount, claimedByName, anonymous, quantity, selection },
      'Items'
    ),

  unclaimItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}/claims`),

  updateItem: (
    itemId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    category?: string | null,
    priority?: number | null,
    sharedWithUserIds?: string[]
  ) =>
    apiClient.put<Item>(
      `/api/items/${itemId}`,
      { name, description, priorityId, category, priority, sharedWithUserIds },
      'Items'
    ),

  deleteItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}`),

  getItemReviews: (itemId: string) =>
    apiClient.get<{ success: boolean; data: { summary: string; pros: string[]; cons: string[]; reviews: string[] } | null }>(`/api/items/${itemId}/reviews`),

  getFieldDefinitions: (category: string) =>
    apiClient.get<FieldDefinition[]>(`/api/items/field-definitions?category=${category}`),
};
export type { ItemLink, Claim, Item, FieldDefinition };
