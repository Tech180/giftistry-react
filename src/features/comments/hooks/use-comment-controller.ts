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
    isRollover?: boolean,
    parentId?: string | null,
    imageUrl?: string | null
  ) => {
    setError(null);
    try {
      const newComment = await commentsApi.addComment(
        listId,
        content,
        commenterName,
        isOwnerVisible,
        isRollover,
        parentId,
        imageUrl
      );
      setComments((prev) => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment.');
      throw err;
    }
  };

  const toggleReaction = async (
    commentId: string,
    reaction: string,
    currentUserId: string,
    currentUsername: string
  ) => {
    setError(null);
    try {
      const res = await commentsApi.toggleReaction(commentId, reaction);
      setComments((prev) =>
        prev.map((c) => {
          if (c.Id !== commentId) return c;
          const existingReactions = c.Reactions || [];
          const hasReacted = existingReactions.some(
            (r) => r.userId === currentUserId && r.reaction === reaction
          );
          let newReactions = [...existingReactions];
          if (hasReacted) {
            newReactions = newReactions.filter(
              (r) => !(r.userId === currentUserId && r.reaction === reaction)
            );
          } else {
            newReactions.push({
              userId: currentUserId,
               username: currentUsername,
              reaction: reaction,
            });
          }
          return { ...c, Reactions: newReactions };
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle reaction.');
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
    toggleReaction,
    deleteComment,
    setComments,
  };
}
