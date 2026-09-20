import type { UserSearchResult } from '../../../interfaces/user-search-result.interface';

export interface TemplateProps {
  query: string;
  setQuery: (query: string) => void;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  onSendRequest: (userId: string) => void;
  sendingId?: string | null;
  pendingUserIds: string[];
  getDisplayName: (user: UserSearchResult) => string;
}
