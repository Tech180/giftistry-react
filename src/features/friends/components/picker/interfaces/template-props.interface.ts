import type { Friend } from '../../../interfaces/friend.interface';

export interface TemplateProps {
  friends: Friend[];
  selectedIds: string[];
  onToggle: (friendUserId: string) => void;
  getDisplayName: (friend: Friend) => string;
  getFriendUserId: (friend: Friend) => string;
}
