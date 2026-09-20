import type { Friend, FriendRequest, UserSearchResult } from 'features/friends';
import type { RemoveTarget } from './remove-target.interface';
import type { SortMethod } from './sort-method.type';
import type { SortOption } from './sort-option.interface';
import type { Tab } from './tab.interface';
import type { TabId } from './tab-id.type';

export interface PageTemplateProps {
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  searchResults: UserSearchResult[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  activeTab: TabId;
  tabs: readonly Tab[];
  sortOptions: readonly SortOption[];
  onTabChange: (tab: TabId) => void;
  onSearch: (query: string) => void;
  onSendRequest: (userId: string) => void;
  onAcceptRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onRequestRemoveFriend: (friendId: string) => void;
  onConfirmRemoveFriend: () => void;
  onCloseRemoveModal: () => void;
  processingId: string | null;
  existingFriendIds: string[];
  pendingUserIds: string[];
  highlightedRequestId: string | null;
  highlightedUserId: string | null;
  totalFriendsCount: number;
  pendingCount: number;
  filterQuery: string;
  onFilterChange: (query: string) => void;
  sortMethod: SortMethod;
  onSortChange: (method: SortMethod) => void;
  friendToRemove: RemoveTarget | null;
}
