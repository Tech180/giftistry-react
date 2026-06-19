import { useState, useCallback } from 'react';
import { commentsApi } from '../api/comments.api';
import { Comment } from '../interfaces/comment.interface';

export function useCommentController() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async (listId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentsApi.listComments(listId);
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addComment = async (
    listId: string,
    content: string,
    commenterName?: string | null,
    isOwnerVisible?: boolean,
    isRollover?: boolean
  ) => {
    setError(null);
    try {
      const newComment = await commentsApi.addComment(
        listId,
        content,
        commenterName,
        isOwnerVisible,
        isRollover
      );
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment.');
      throw err;
    }
  };

  const deleteComment = async (listId: string, commentId: string) => {
    try {
      await commentsApi.deleteComment(listId, commentId);
      setComments((prev) =>
        prev.map((c) =>
          c.Id === commentId
            ? { ...c, IsDeleted: true, Content: 'Comment was deleted.' }
            : c
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment.');
      throw err;
    }
  };

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
    setComments,
  };
}
