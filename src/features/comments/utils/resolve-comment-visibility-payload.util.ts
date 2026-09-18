import type { CommentVisibilityState } from '../interfaces/comment-visibility-state.interface';

export interface CommentVisibilityPayload {
  isOwnerVisible: boolean;
  visibleToUserIds: string[] | null;
}

export function resolveCommentVisibilityPayload(
  state: CommentVisibilityState,
  isOwner: boolean
): CommentVisibilityPayload {
  if (isOwner && state.mode === 'hiddenFromOwner') {
    return { isOwnerVisible: true, visibleToUserIds: null };
  }

  if (state.mode === 'hiddenFromOwner') {
    return { isOwnerVisible: false, visibleToUserIds: null };
  }

  if (state.mode === 'visibleToSelected') {
    const unique = [...new Set(state.selectedUserIds.filter(Boolean))];
    if (unique.length === 0) {
      return { isOwnerVisible: true, visibleToUserIds: null };
    }
    return { isOwnerVisible: true, visibleToUserIds: unique };
  }

  return { isOwnerVisible: true, visibleToUserIds: null };
}
