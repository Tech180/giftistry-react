import { apiClient } from 'api/client';
import { Wishlist, ListShare } from '../interfaces/wishlist.interface';
import { Priority } from '../interfaces/priority.interface';

export const wishlistsApi = {
  listWishlists: () =>
    apiClient.get<Wishlist[]>('/api/wishlists'),

  getWishlist: (listId: string) =>
    apiClient.get<Wishlist>(`/api/wishlists/${listId}`),

  createWishlist: (title: string, expiresAt?: string | null, allowGroupFunds?: boolean) =>
    apiClient.post<Wishlist>(
      '/api/wishlists',
      { title, expiresAt: expiresAt || null, allowGroupFunds: !!allowGroupFunds },
      'Lists'
    ),

  deactivateWishlist: (listId: string) =>
    apiClient.put<{ success: boolean }>(`/api/wishlists/${listId}/deactivate`, {}),

  shareWishlist: (listId: string, email: string, role: 'viewer' | 'collaborator') =>
    apiClient.post<ListShare>(
      `/api/wishlists/${listId}/shares`,
      { email, role },
      'Lists'
    ),

  listPriorities: () =>
    apiClient.get<Priority[]>('/api/priorities'),

  createPriority: (label: string, weight: number) =>
    apiClient.post<Priority>(
      '/api/priorities',
      { label, weight },
      'Priorities'
    ),
};
