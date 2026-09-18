import type { Item } from 'features/items';
import type { CommentVisibilityState } from '../../../../../interfaces/comment-visibility-state.interface';
import type { ListParticipant } from '../../../../../interfaces/list-participant.interface';

export interface FooterProps {
  isOwner: boolean;
  commentVisibility: CommentVisibilityState;
  setCommentVisibility: (next: CommentVisibilityState) => void;
  isRollover: boolean;
  setIsRollover: (rollover: boolean) => void;
  autoRollover?: boolean;
  items: Item[];
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  listOwnerId?: string;
}
