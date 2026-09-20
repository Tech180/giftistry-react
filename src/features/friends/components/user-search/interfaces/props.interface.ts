import type { UserSearchResult } from '../../../interfaces/user-search-result.interface';

export interface Props {
  searchResults: UserSearchResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSendRequest: (userId: string) => void;
  sendingId?: string | null;
  existingFriendIds?: string[];
  pendingUserIds?: string[];
}
