import type { Comment } from './comment.interface';
import type { Item } from 'features/items';
import type { Wishlist } from 'features/wishlists';

export interface DemoListState {
  active: boolean;
  wishlist: Wishlist | null;
  items: Item[];
  comments: Comment[];
  typingUsers: string[];
  claimedItemId: string | null;
  /** Item id that should show the shared attention pulse (e.g. Jordan’s new gift). */
  highlightedItemId: string | null;
  /** Comment id that should show the shared attention pulse (e.g. Sam’s new comment). */
  highlightedCommentId: string | null;
}

export interface DemoListContextType extends DemoListState {
  activate: (ownerId: string, ownerName: string) => void;
  deactivate: () => void;
  clearHighlight: () => void;
  runBeat: (beat: 'seed' | 'addItem' | 'typing' | 'comment' | 'claim') => void;
}
