import type { CommentVisibilityState } from './comment-visibility-state.interface';
import { Item } from 'features/items';
import { ListParticipant } from './list-participant.interface';

export interface CommentInputProps {
  isOwner: boolean;
  commentVisibility: CommentVisibilityState;
  setCommentVisibility: (next: CommentVisibilityState) => void;
  isRollover: boolean;
  setIsRollover: (rollover: boolean) => void;
  autoRollover?: boolean;
  content: string;
  setContent: (content: string) => void;
  commenterName: string;
  setCommenterName: (name: string) => void;
  isSubmitLoading: boolean;
  handleSubmit: (e: React.SyntheticEvent) => void;
  items: Item[];
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  typingUsers: string[];
  isAnonymous: boolean;
  setIsAnonymous: (anonymous: boolean) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  listOwnerId?: string;
  imageUrl?: string | null;
  setImageUrl?: (url: string | null) => void;
  onMentionSelect?: (userId: string) => void;
}
