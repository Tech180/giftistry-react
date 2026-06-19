import { apiClient } from 'api/client';
import { Wishlist } from '../interfaces/wishlist.interface';
import { ListShare } from '../interfaces/list-share.interface';
import { Priority } from '../interfaces/priority.interface';

export const wishlistsApi = {
  listWishlists: () =>
    apiClient.get<Wishlist[]>('/api/wishlists'),

  getWishlist: (listId: string) =>
    apiClient.get<Wishlist>(`/api/wishlists/${listId}`),

  createWishlist: (title: string, expiresAt?: string | null, allowGroupFunds?: boolean, category?: string, revealSuggestions?: boolean) =>
    apiClient.post<Wishlist>(
      '/api/wishlists',
      { title, expiresAt: expiresAt || null, allowGroupFunds: !!allowGroupFunds, category, revealSuggestions },
      'Lists'
    ),

  deactivateWishlist: (listId: string) =>
    apiClient.put<{ success: boolean }>(`/api/wishlists/${listId}/deactivate`, {}),

  deleteWishlist: (listId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/wishlists/${listId}`),

  updateWishlist: (listId: string, title: string, expiresAt?: string | null, allowGroupFunds?: boolean, category?: string, revealSuggestions?: boolean) =>
    apiClient.put<Wishlist>(
      `/api/wishlists/${listId}`,
      { title, expiresAt: expiresAt || null, allowGroupFunds: !!allowGroupFunds, category, revealSuggestions },
      'Lists'
    ),

  shareWishlist: (listId: string, email: string, role: 'viewer' | 'collaborator') =>
    apiClient.post<ListShare>(
      `/api/wishlists/${listId}/shares`,
      { email, role },
      'Lists'
    ),

  listPriorities: (wishlistId?: string) =>
    apiClient.get<Priority[]>(wishlistId ? `/api/priorities?wishlistId=${wishlistId}` : '/api/priorities'),

  createPriority: (label: string, weight: number) =>
    apiClient.post<Priority>(
      '/api/priorities',
      { label, weight },
      'Priorities'
    ),

  deletePriority: (id: string) =>
    apiClient.delete<void>(`/api/priorities/${id}`),
};
