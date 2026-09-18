import type { CommentVisibilityState } from '../interfaces/comment-visibility-state.interface';

export const DEFAULT_COMMENT_VISIBILITY: CommentVisibilityState = {
  mode: 'hiddenFromOwner',
  selectedUserIds: [],
};

export const OWNER_DEFAULT_COMMENT_VISIBILITY: CommentVisibilityState = {
  mode: 'visibleToAll',
  selectedUserIds: [],
};
