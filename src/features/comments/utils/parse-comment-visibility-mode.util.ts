import type { CommentVisibilityMode } from '../interfaces/comment-visibility-mode.type';

export function parseCommentVisibilityMode(comment: {
  IsOwnerVisible: boolean;
  VisibleToUserIds?: string[] | null;
}): CommentVisibilityMode {
  if (Array.isArray(comment.VisibleToUserIds) && comment.VisibleToUserIds.length > 0) {
    return 'visibleToSelected';
  }
  return comment.IsOwnerVisible === false ? 'hiddenFromOwner' : 'visibleToAll';
}
