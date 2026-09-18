import type { CommentVisibilityMode } from '../interfaces/comment-visibility-mode.type';

export function resolveCommentVisibilityBadgeLabel(
  mode: CommentVisibilityMode,
  selectedCount: number
): string {
  if (mode === 'hiddenFromOwner') {
    return 'Invisible to Owner';
  }
  if (mode === 'visibleToSelected') {
    return selectedCount > 0 ? `Visible to ${selectedCount}` : 'Selected audience';
  }
  return 'Visible to Owner';
}
