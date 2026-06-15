import { apiClient } from 'api/client';
import { ItemLink } from '../interfaces/item-link.interface';
import { Claim } from '../interfaces/item-claim.interface';
import { Item } from '../interfaces/item.interface';

export const itemsApi = {
  listItems: (listId: string) =>
    apiClient.get<Item[]>(`/api/wishlists/${listId}/items`),

  addItem: (
    listId: string,
    name: string,
    description?: string | null,
    priorityId?: string | null,
    isHiddenIdea?: boolean
  ) =>
    apiClient.post<Item>(
      `/api/wishlists/${listId}/items`,
      { name, description, priorityId, isHiddenIdea },
      'Items'
    ),

  addItemLink: (itemId: string, url: string) =>
    apiClient.post<ItemLink>(
      `/api/items/${itemId}/links`,
      { url },
      'Items'
    ),

  claimItem: (itemId: string, amount?: number | null, claimedByName?: string | null) =>
    apiClient.post<Claim>(
      `/api/items/${itemId}/claims`,
      { amount, claimedByName },
      'Items'
    ),
};
export type { ItemLink, Claim, Item };
