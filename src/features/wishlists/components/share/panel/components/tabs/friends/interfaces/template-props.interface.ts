import type { Friend } from 'features/friends/interfaces/friend.interface';

export interface TemplateProps {
  variant?: 'classic' | 'compact';
  search: string;
  setSearch: (s: string) => void;
  roles: Record<string, 'viewer' | 'collaborator'>;
  setRole: (friendId: string, role: 'viewer' | 'collaborator') => void;
  loadingIds: Record<string, boolean>;
  errorMsg: string | null;
  successMsg: string | null;
  filteredFriends: Friend[];
  handleShareSingle: (friendId: string) => void;
  getInitials: (firstName?: string, lastName?: string, username?: string) => string;
}
