import { ListParticipant } from '../../../../../../interfaces/list-participant.interface';
import type { CommentVisibilityMode } from '../../../../../../interfaces/comment-visibility-mode.type';

export interface EditorProps {
  content: string;
  setContent: (content: string) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  isOwner?: boolean;
  visibilityMode?: CommentVisibilityMode;
  selectedUserIds?: string[];
  /** @deprecated Prefer visibilityMode */
  isOwnerVisible?: boolean;
  listOwnerId?: string;
  onSubmit: (e: React.SyntheticEvent) => void;
  onMentionAudienceSelect?: (userId: string) => void;
}
