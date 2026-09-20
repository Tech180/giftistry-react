import type { Friend, FriendRequest, UserSearchResult } from 'features/friends';
import type { TabId } from '../../../interfaces/tab-id.type';

export interface Props {
  activeTab: TabId;
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  searchResults: UserSearchResult[];
  isLoading: boolean;
  isSearching: boolean;
  processingId: string | null;
  existingFriendIds: string[];
  pendingUserIds: string[];
  highlightedRequestId: string | null;
  highlightedUserId: string | null;
  onSearch: (query: string) => void;
  onSendRequest: (userId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onRequestRemoveFriend: (friendId: string) => void;
}
