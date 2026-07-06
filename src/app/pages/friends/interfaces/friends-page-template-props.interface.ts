import { Friend, FriendRequest, UserSearchResult } from 'features/friends';

export interface ExtendedFriend extends Friend {
  birthday?: string;
  wishlistCount?: number;
  mutualsCount?: number;
  recentActivity?: string;
  daysUntilBirthday?: number;
}

export interface FriendsPageTemplateProps {
  friends: ExtendedFriend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  searchResults: UserSearchResult[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  activeTab: 'current' | 'requests' | 'search';
  setActiveTab: (tab: 'current' | 'requests' | 'search') => void;
  onSearch: (query: string) => void;
  onSendRequest: (userId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onRemoveFriend: (friendId: string) => void;
  processingId: string | null;
  existingFriendIds: string[];
  pendingUserIds: string[];
  highlightedRequestId?: string | null;
  highlightedUserId?: string | null;
  
  // Filter, Sort and Modal props
  totalFriendsCount: number;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  sortMethod: 'name' | 'recent' | 'birthday';
  setSortMethod: (method: 'name' | 'recent' | 'birthday') => void;
  friendToRemove: { id: string; name: string } | null;
  setFriendToRemove: (friend: { id: string; name: string } | null) => void;
}


