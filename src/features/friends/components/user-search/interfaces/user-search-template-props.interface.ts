import { UserSearchResult } from '../../../interfaces/friend.interface';

export interface UserSearchTemplateProps {
  query: string;
  setQuery: (val: string) => void;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  onSendRequest: (userId: string) => void;
  sendingId?: string | null;
  existingFriendIds: string[];
  pendingUserIds: string[];
  getDisplayName: (user: UserSearchResult) => string;
}
