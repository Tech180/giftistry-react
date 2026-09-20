import type { Comment } from '../../../interfaces/comment.interface';

export interface UseParticipantsParams {
  listId: string;
  listOwnerId?: string;
  ownerUsername?: string;
  ownerDisplayName?: string;
  isAuthenticated: boolean;
  currentUserId?: string;
  currentUserAvatar?: string | null;
  comments: Comment[];
}
