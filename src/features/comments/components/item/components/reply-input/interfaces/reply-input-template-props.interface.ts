import type { Item } from 'features/items';
import type { ListParticipant } from '../../../../interfaces/list-participant.interface';
import type { CommentVisibilityState } from '../../../../interfaces/comment-visibility-state.interface';
import type { CommentEditorHandle } from '../../../input/components/input/editor';

export interface ReplyInputTemplateProps {
  replyToName: string;
  items: Item[];
  taggedItemIds: string[];
  uploadError: string | null;
  imageUrl: string | null;
  onRemoveAttachment: () => void;
  editorHandle: React.RefObject<CommentEditorHandle | null>;
  content: string;
  setContent: (content: string) => void;
  participants: ListParticipant[];
  currentUserId?: string;
  isOwner: boolean;
  commentVisibility: CommentVisibilityState;
  listOwnerId?: string;
  onSubmit: (e: React.SyntheticEvent) => void;
  setImageUrl: (url: string | null) => void;
  onUploadError: (message: string | null) => void;
  isSubmitting: boolean;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  onCancel: () => void;
  onMentionAudienceSelect?: (userId: string) => void;
  footer: React.ReactNode;
}
