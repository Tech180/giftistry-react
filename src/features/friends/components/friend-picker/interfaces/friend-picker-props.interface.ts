import { Friend } from '../../../interfaces/friend.interface';

export interface FriendPickerProps {
  friends: Friend[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  currentUserId?: string;
}
