import { useState } from 'react';
import { commentsApi } from '../api/comments.api';
import { Comment } from '../interfaces/comment.interface';
import { appendUniqueComment } from '../utils/append-unique-comment.util';
import { mergeCommentListFromFetch } from '../utils/merge-comment-list-from-fetch.util';

export function useCommentController() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (listId: string) => {
    setIsLoading(true);
    setHasLoadedComments(false);
    setError(null);

    try {
      const data = await commentsApi.listComments(listId);
      setComments((prev) => mergeCommentListFromFetch(data || [], prev));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments.');
    } finally {
      setIsLoading(false);
      setHasLoadedComments(true);
    }
  };

  const addComment = async (
    listId: string,
    content: string,
    commenterName?: string | null,
    isOwnerVisible?: boolean,
    isRollover?: boolean,
    parentId?: string | null,
    imageUrl?: string | null,
    visibleToUserIds?: string[] | null
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
        imageUrl,
        visibleToUserIds
      );
      setComments((prev) => appendUniqueComment(prev, newComment));
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
      const { Added } = await commentsApi.toggleReaction(commentId, reaction);
      const normalizedUserId = String(currentUserId);

      setComments((prev) =>
        prev.map((c) => {
          if (c.Id !== commentId) {
            return c;
          }

          const existingReactions = c.Reactions ?? [];

          if (Added) {
            const alreadyPresent = existingReactions.some(
              (r) => String(r.UserId) === normalizedUserId && r.Reaction === reaction
            );

            if (alreadyPresent) {
              return c;
            }

            return {
              ...c,
              Reactions: [
                ...existingReactions,
                {
                  UserId: currentUserId,
                  Username: currentUsername,
                  Reaction: reaction,
                },
              ],
            };
          }

          return {
            ...c,
            Reactions: existingReactions.filter(
              (r) => !(String(r.UserId) === normalizedUserId && r.Reaction === reaction)
            ),
          };
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
    hasLoadedComments,
    error,
    fetchComments,
    addComment,
    toggleReaction,
    deleteComment,
    setComments,
  };
}
