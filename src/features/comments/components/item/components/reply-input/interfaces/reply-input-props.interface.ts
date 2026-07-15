import { Item } from 'features/items';
import { ListParticipant } from '../../../../../interfaces/list-participant.interface';

export interface ReplyInputProps {
  replyToName: string;
  participants: ListParticipant[];
  items: Item[];
  currentUserId?: string | null;
  isOwner: boolean;
  isOwnerVisible: boolean;
  listOwnerId?: string;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  taggedItemIds: string[];
  onSubmit: (content: string, imageUrl: string | null) => Promise<void>;
  onCancel: () => void;
}
