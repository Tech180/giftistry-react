import type { Friend } from '../../../interfaces/friend.interface';

export interface TemplateProps {
  friends: Friend[];
  onRemove: (friendId: string) => void;
  removingId?: string | null;
  highlightedUserId?: string | null;
  hoveredUserId: string | null;
  onHoverChange: (userId: string | null) => void;
  getDisplayName: (friend: Friend) => string;
  getFriendUserId: (friend: Friend) => string;
  getFriendInitials: (friend: Friend) => string;
  isBirthdayNear: (daysUntilBirthday?: number) => boolean;
}
