import type { Item } from 'features/items';
import type { ListParticipant } from '../../../interfaces/list-participant.interface';

export interface UseComposerParams {
  listId: string;
  isOwner: boolean;
  isArchived: boolean;
  isAuthenticated: boolean;
  autoRollover: boolean;
  userId?: string;
  userUsername?: string;
  participants: ListParticipant[];
  items: Item[];
  taggedItemIds: string[];
  setTaggedItemIds: (ids: string[]) => void;
  setIsTaggingModeActive: (active: boolean) => void;
  addComment: (
    listId: string,
    content: string,
    commenterName?: string | null,
    isOwnerVisible?: boolean,
    isRollover?: boolean,
    parentId?: string | null,
    imageUrl?: string | null,
    visibleToUserIds?: string[] | null,
  ) => Promise<unknown>;
  deleteComment: (listId: string, commentId: string) => Promise<void>;
  toggleReaction: (
    commentId: string,
    reaction: string,
    currentUserId: string,
    currentUsername: string,
  ) => Promise<void>;
  notifyTypingStart: () => void;
  notifyTypingStop: () => void;
  onPosted: () => void;
  controllerError: string | null;
}
