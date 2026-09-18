import type { CommentVisibilityMode } from './comment-visibility-mode.type';

export interface CommentVisibilityState {
  mode: CommentVisibilityMode;
  selectedUserIds: string[];
}
