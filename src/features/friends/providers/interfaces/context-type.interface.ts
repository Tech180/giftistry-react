import type { Friend } from '../../interfaces/friend.interface';
import type { FriendRequest } from '../../interfaces/friend-request.interface';
import type { UserSearchResult } from '../../interfaces/user-search-result.interface';

export interface FriendsContextType {
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  searchResults: UserSearchResult[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  fetchFriends: () => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  sendRequest: (userId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
}
