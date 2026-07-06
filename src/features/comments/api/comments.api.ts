import { apiClient } from 'core/api/client';
import { Comment } from '../interfaces/comment.interface';

export const commentsApi = {
  listComments: (listId: string) =>
    apiClient.get<Comment[]>(`/api/wishlists/${listId}/comments`),

  addComment: (
    listId: string,
    content: string,
    commenterName?: string | null,
    isOwnerVisible?: boolean,
    isRollover?: boolean,
    parentId?: string | null,
    imageUrl?: string | null
  ) =>
    apiClient.post<Comment>(
      `/api/wishlists/${listId}/comments`,
      { content, commenterName, isOwnerVisible, isRollover, parentId, imageUrl },
      'Comments'
    ),

  toggleReaction: (commentId: string, reaction: string) =>
    apiClient.post<{ added: boolean }>(
      `/api/comments/${commentId}/react`,
      { reaction },
      'Comments'
    ),

  deleteComment: (listId: string, commentId: string) =>
    apiClient.delete(`/api/wishlists/${listId}/comments/${commentId}`),
};
export type { Comment };
