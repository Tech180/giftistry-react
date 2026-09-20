import type { ListCounts } from './list-counts.interface';
import type { Wishlist } from './wishlist.interface';

export interface WishlistsPayload {
  Wishlists?: Wishlist[];
  Counts?: ListCounts;
}
