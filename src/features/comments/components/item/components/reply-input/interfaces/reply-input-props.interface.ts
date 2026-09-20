import type { Item } from 'features/items';
import type { ListParticipant } from '../../../../../interfaces/list-participant.interface';
import type { CommentVisibilityState } from '../../../../../interfaces/comment-visibility-state.interface';
import type { CommentEditorHandle } from '../../../../input/components/editor';

export interface ReplyInputProps {
  replyToName: string;
  participants: ListParticipant[];
  items: Item[];
  currentUserId?: string | null;
  isOwner: boolean;
  listOwnerId?: string;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  taggedItemIds: string[];
  onSubmit: (
    content: string,
    imageUrl: string | null,
    visibility: CommentVisibilityState
  ) => Promise<void>;
  onCancel: () => void;
}
