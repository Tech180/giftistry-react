import type { CommentVisibilityState } from '../../../../../interfaces/comment-visibility-state.interface';
import type { ListParticipant } from '../../../../../interfaces/list-participant.interface';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  visibility: CommentVisibilityState;
  onChange: (next: CommentVisibilityState) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  listOwnerId?: string;
  isOwner: boolean;
  /** When true, render as bottom sheet instead of anchored dropdown. */
  isMobile: boolean;
  anchorRef?: React.RefObject<HTMLElement | null>;
}
