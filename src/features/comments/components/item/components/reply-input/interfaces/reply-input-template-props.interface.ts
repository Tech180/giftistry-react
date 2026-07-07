import { Item } from 'features/items';
import { ListParticipant } from '../../../../../interfaces/list-participant.interface';
import type { CommentEditorHandle } from '../../../../../components/input/components/input/editor';

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
  onSubmit: (e: React.SyntheticEvent) => void;
  setImageUrl: (url: string | null) => void;
  onUploadError: (message: string | null) => void;
  isSubmitting: boolean;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  onCancel: () => void;
}
