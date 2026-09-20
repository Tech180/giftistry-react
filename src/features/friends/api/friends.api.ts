import { apiClient } from 'core/api/client';
import type { Friend } from '../interfaces/friend.interface';
import type { FriendRequest } from '../interfaces/friend-request.interface';
import type { FriendRequestsResult } from '../interfaces/friend-requests-result.interface';
import type { UserSearchResult } from '../interfaces/user-search-result.interface';

export const friendsApi = {
  listFriends: () =>
    apiClient.get<Friend[]>('/api/friends'),

  listFriendRequests: () =>
    apiClient.get<FriendRequestsResult>('/api/friends/requests'),

  sendRequest: (receiverId: string) =>
    apiClient.post<FriendRequest>('/api/friends/requests', { ReceiverId: receiverId }, 'Friends'),

  acceptRequest: (requestId: string) =>
    apiClient.post<FriendRequest>(`/api/friends/requests/${requestId}/accept`, {}),

  rejectRequest: (requestId: string) =>
    apiClient.post<Record<string, never>>(`/api/friends/requests/${requestId}/decline`, {}),

  removeFriend: (friendUserId: string) =>
    apiClient.delete<Record<string, never>>(`/api/friends/${friendUserId}`),

  searchUsers: (query: string) =>
    apiClient.get<UserSearchResult[]>(`/api/users/search?q=${encodeURIComponent(query)}`),
};
