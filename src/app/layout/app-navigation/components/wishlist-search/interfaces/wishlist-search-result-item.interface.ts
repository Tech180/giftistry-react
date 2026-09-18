import type { Wishlist } from 'features/wishlists';

export interface WishlistSearchResultItem {
  wishlist: Wishlist;
  isActive: boolean;
  onSelect: () => void;
  onHover: () => void;
}
