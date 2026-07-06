import { Friend } from '../../../interfaces/friend.interface';

export interface FriendListProps {
  friends: Friend[];
  currentUserId?: string;
  onRemove: (friendId: string) => void;
  removingId?: string | null;
  highlightedUserId?: string | null;
}
