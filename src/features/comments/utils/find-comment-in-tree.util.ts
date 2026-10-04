import type { Comment } from '../interfaces/comment.interface';
import type { FindCommentInTreeResult } from '../interfaces/find-comment-in-tree-result.interface';

export function findCommentInTree(
  comments: Comment[],
  commentId: string
): FindCommentInTreeResult | null {
  const comment = comments.find((entry) => entry.Id === commentId);
  if (!comment) {
    return null;
  }

  return {
    comment,
    parentId: comment.ParentId ?? null,
  };
}
