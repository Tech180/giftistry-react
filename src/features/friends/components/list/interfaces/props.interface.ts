import type { Friend } from '../../../interfaces/friend.interface';

export interface Props {
  friends: Friend[];
  onRemove: (friendId: string) => void;
  removingId?: string | null;
  highlightedUserId?: string | null;
}
