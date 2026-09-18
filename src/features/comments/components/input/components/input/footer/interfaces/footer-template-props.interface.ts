import { FooterProps } from './footer-props.interface';
import type { CommentVisibilityState } from '../../../../../interfaces/comment-visibility-state.interface';
import type { ListParticipant } from '../../../../../interfaces/list-participant.interface';

export interface FooterTemplateProps {
  isOwner: boolean;
  commentVisibility: CommentVisibilityState;
  setCommentVisibility: (next: CommentVisibilityState) => void;
  isRollover: boolean;
  setIsRollover: (rollover: boolean) => void;
  autoRollover?: boolean;
  items: FooterProps['items'];
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  listOwnerId?: string;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  isMobile: boolean;
}
