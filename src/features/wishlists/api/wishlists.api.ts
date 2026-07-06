import { apiClient } from 'core/api/client';
import { Wishlist } from '../interfaces/wishlist.interface';
import { ListShare } from '../interfaces/list-share.interface';
import { Priority } from '../interfaces/priority.interface';

export const wishlistsApi = {
  listWishlists: () =>
    apiClient.get<Wishlist[]>('/api/wishlists'),

  getWishlist: (listId: string) =>
    apiClient.get<Wishlist>(`/api/wishlists/${listId}`),

  createWishlist: (
    title: string,
    expiresAt?: string | null,
    allowGroupFunds?: boolean,
    category?: string,
    revealSuggestions?: boolean,
    aiEnabled?: boolean,
    visibility?: 'private' | 'friends' | 'link',
  ) =>
    apiClient.post<Wishlist>(
      '/api/wishlists',
      { title, expiresAt: expiresAt || null, allowGroupFunds: !!allowGroupFunds, category, revealSuggestions, aiEnabled, visibility },
      'Lists'
    ),

  deactivateWishlist: (listId: string) =>
    apiClient.put<{ success: boolean }>(`/api/wishlists/${listId}/deactivate`, {}),

  deleteWishlist: (listId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/wishlists/${listId}`),

  updateWishlist: (
    listId: string,
    title: string,
    expiresAt?: string | null,
    allowGroupFunds?: boolean,
    category?: string,
    revealSuggestions?: boolean,
    aiEnabled?: boolean,
    visibility?: 'private' | 'friends' | 'link',
  ) =>
    apiClient.put<Wishlist>(
      `/api/wishlists/${listId}`,
      { title, expiresAt: expiresAt || null, allowGroupFunds: !!allowGroupFunds, category, revealSuggestions, aiEnabled, visibility },
      'Lists'
    ),

  shareWishlist: (listId: string, email: string, role: 'viewer' | 'collaborator') =>
    apiClient.post<ListShare>(
      `/api/wishlists/${listId}/shares`,
      { email, role },
      'Lists'
    ),

  listShares: (listId: string) =>
    apiClient.get<ListShare[]>(`/api/wishlists/${listId}/shares`),

  updateShare: (listId: string, shareId: string, role: 'viewer' | 'collaborator') =>
    apiClient.patch<ListShare>(
      `/api/wishlists/${listId}/shares/${shareId}`,
      { role }
    ),

  removeShare: (listId: string, shareId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/wishlists/${listId}/shares/${shareId}`),

  bulkShareWithFriends: (listId: string, friendIds: string[], role: 'viewer' | 'collaborator') =>
    apiClient.post<ListShare[]>(
      `/api/wishlists/${listId}/shares/bulk`,
      { friendIds, role }
    ),

  generateShareLink: (
    listId: string,
    role: 'viewer' | 'collaborator' = 'viewer',
    expiresAt?: string | null,
    maxUses?: number | null,
    password?: string | null
  ) =>
    apiClient.post<{ invite: any; token: string }>(
      `/api/wishlists/${listId}/link-invites`,
      { role, expiresAt, maxUses, password }
    ),

  listLinkInvites: (listId: string) =>
    apiClient.get<any[]>(`/api/wishlists/${listId}/link-invites`),

  revokeLinkInvite: (listId: string, inviteId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/wishlists/${listId}/link-invites/${inviteId}`),

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
