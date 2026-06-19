import { apiClient } from 'api/client';
import { ItemLink } from '../interfaces/item-link.interface';
import { Claim } from '../interfaces/item-claim.interface';
import { Item } from '../interfaces/item.interface';
import { FieldDefinition } from '../interfaces/item-field.interface';

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
    category?: string | null
  ) =>
    apiClient.post<Item>(
      `/api/wishlists/${listId}/items`,
      { name, description, priorityId, isHiddenIdea, linkUrl, price, websiteName, category },
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

  claimItem: (itemId: string, amount?: number | null, claimedByName?: string | null, anonymous?: boolean) =>
    apiClient.post<Claim>(
      `/api/items/${itemId}/claims`,
      { amount, claimedByName, anonymous },
      'Items'
    ),

  unclaimItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}/claims`),

  updateItem: (
    itemId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    category?: string | null
  ) =>
    apiClient.put<Item>(
      `/api/items/${itemId}`,
      { name, description, priorityId, category },
      'Items'
    ),

  deleteItem: (itemId: string) =>
    apiClient.delete<void>(`/api/items/${itemId}`),

  getFieldDefinitions: (category: string) =>
    apiClient.get<FieldDefinition[]>(`/api/items/field-definitions?category=${category}`),
};
export type { ItemLink, Claim, Item, FieldDefinition };
