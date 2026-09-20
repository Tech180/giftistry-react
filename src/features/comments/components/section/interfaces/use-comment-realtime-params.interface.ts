import type { Dispatch, SetStateAction } from 'react';
import type { Comment } from '../../../interfaces/comment.interface';

export interface UseCommentRealtimeParams {
  listId: string;
  isAuthenticated: boolean;
  userId?: string;
  isOwner: boolean;
  isExpired: boolean;
  setComments: Dispatch<SetStateAction<Comment[]>>;
}
