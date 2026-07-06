import { Item } from 'features/items';
import { ListParticipant } from './list-participant.interface';

export interface CommentReplyInputProps {
  replyToName: string;
  participants: ListParticipant[];
  items: Item[];
  currentUserId?: string | null;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  taggedItemIds: string[];
  onSubmit: (content: string, imageUrl: string | null) => Promise<void>;
  onCancel: () => void;
}
