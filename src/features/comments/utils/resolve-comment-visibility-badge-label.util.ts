import {
  COMMENT_VISIBILITY_EVERYONE_LABEL,
  COMMENT_VISIBILITY_SELECTED_LABEL,
} from '../constants/comment-visibility-labels.constant';
import type { CommentVisibilityMode } from '../interfaces/comment-visibility-mode.type';

export function resolveCommentVisibilityBadgeLabel(mode: CommentVisibilityMode): string {
  if (mode === 'hiddenFromOwner') {
    return 'Invisible to Owner';
  }
  if (mode === 'visibleToSelected') {
    return COMMENT_VISIBILITY_SELECTED_LABEL;
  }
  return COMMENT_VISIBILITY_EVERYONE_LABEL;
}
