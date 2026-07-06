import { UserSearchResult } from '../../../interfaces/friend.interface';

export interface UserSearchProps {
  searchResults: UserSearchResult[];
  isSearching: boolean;
  onSearch: (query: string) => void;
  onSendRequest: (userId: string) => void;
  sendingId?: string | null;
  existingFriendIds?: string[];
  pendingUserIds?: string[];
}
