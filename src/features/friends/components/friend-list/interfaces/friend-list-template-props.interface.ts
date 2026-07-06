import { FriendListProps } from '../interfaces/friend-list-props.interface';
import { Friend } from '../../../interfaces/friend.interface';

export interface FriendListTemplateProps {
  friends: Friend[];
  currentUserId?: string;
  onRemove: (friendId: string) => void;
  removingId?: string | null;
  highlightedUserId?: string | null;
  getDisplayName: (friend: Friend) => string;
  getFriendUserId: (friend: Friend) => string;
}
