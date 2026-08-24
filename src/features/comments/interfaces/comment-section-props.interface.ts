import { Item } from 'features/items';
import { ListParticipant } from './list-participant.interface';

export interface CommentSectionProps {
  listId: string;
  listOwnerId?: string;
  ownerUsername?: string;
  ownerDisplayName?: string;
  isOwner: boolean;
  isExpired?: boolean;
  isArchived?: boolean;
  autoRollover?: boolean;
  items?: Item[];
  onItemTaggedClick?: (itemId: string) => void;
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (val: boolean) => void;
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  isReplyTaggingModeActive: boolean;
  setIsReplyTaggingModeActive: (val: boolean) => void;
  replyTaggedItemIds: string[];
  setReplyTaggedItemIds: (ids: string[]) => void;
  /** When true, soft-deleted comments remain visible in the thread. Defaults to false. */
  showDeletedComments?: boolean;
}
