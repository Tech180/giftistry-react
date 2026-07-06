import { Friend } from '../../../interfaces/friend.interface';

export interface FriendPickerTemplateProps {
  friends: Friend[];
  selectedIds: string[];
  onToggle: (friendUserId: string) => void;
  getDisplayName: (friend: Friend) => string;
  getFriendUserId: (friend: Friend) => string;
}
