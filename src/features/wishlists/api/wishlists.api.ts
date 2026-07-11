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
  ) =>
    apiClient.post<Wishlist>(
      '/api/wishlists',
      {
        Title: title,
        ExpiresAt: expiresAt || null,
        AllowGroupFunds: !!allowGroupFunds,
        Category: category,
        RevealSuggestions: revealSuggestions,
        AiEnabled: aiEnabled,
      },
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
  ) =>
    apiClient.put<Wishlist>(
      `/api/wishlists/${listId}`,
      {
        Title: title,
        ExpiresAt: expiresAt || null,
        AllowGroupFunds: !!allowGroupFunds,
        Category: category,
        RevealSuggestions: revealSuggestions,
        AiEnabled: aiEnabled,
      },
      'Lists'
    ),

  shareWishlist: (listId: string, email: string, role: 'viewer' | 'collaborator') =>
    apiClient.post<ListShare>(
      `/api/wishlists/${listId}/shares`,
      { Email: email, Role: role },
      'Lists'
    ),

  listShares: (listId: string) =>
    apiClient.get<ListShare[]>(`/api/wishlists/${listId}/shares`),

  updateShare: (listId: string, shareId: string, role: 'viewer' | 'collaborator') =>
    apiClient.patch<ListShare>(
      `/api/wishlists/${listId}/shares/${shareId}`,
      { Role: role },
      'Lists'
    ),

  removeShare: (listId: string, shareId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/wishlists/${listId}/shares/${shareId}`),

  bulkShareWithFriends: (listId: string, friendIds: string[], role: 'viewer' | 'collaborator') =>
    apiClient.post<ListShare[]>(
      `/api/wishlists/${listId}/shares/bulk`,
      { FriendIds: friendIds, Role: role },
      'Lists'
    ),

  generateShareLink: (
    listId: string,
    role: 'viewer' | 'collaborator' = 'viewer',
    expiresAt?: string | null,
    maxUses?: number | null,
    password?: string | null
  ) =>
    apiClient.post<{ Invite: unknown; Token: string }>(
      `/api/wishlists/${listId}/link-invites`,
      { Role: role, ExpiresAt: expiresAt, MaxUses: maxUses, Password: password },
      'Invites'
    ),

  listLinkInvites: (listId: string) =>
    apiClient.get<unknown[]>(`/api/wishlists/${listId}/link-invites`),

  revokeLinkInvite: (listId: string, inviteId: string) =>
    apiClient.delete<{ success: boolean }>(`/api/wishlists/${listId}/link-invites/${inviteId}`),

  listPriorities: (wishlistId?: string) =>
    apiClient.get<Priority[]>(wishlistId ? `/api/priorities?wishlistId=${wishlistId}` : '/api/priorities'),

  createPriority: (label: string, weight: number) =>
    apiClient.post<Priority>(
      '/api/priorities',
      { Label: label, Weight: weight },
      'Priorities'
    ),

  deletePriority: (id: string) =>
    apiClient.delete<void>(`/api/priorities/${id}`),
};
