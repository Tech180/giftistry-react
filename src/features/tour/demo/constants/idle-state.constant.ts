import type { DemoListState } from '../interfaces/context-type.interface';

export const IDLE_STATE: DemoListState = {
  active: false,
  wishlist: null,
  items: [],
  comments: [],
  typingUsers: [],
  claimedItemId: null,
  highlightedItemId: null,
  highlightedCommentId: null,
};
