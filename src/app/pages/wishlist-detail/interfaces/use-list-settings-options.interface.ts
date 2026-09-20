import type { Wishlist } from 'features/wishlists';

export interface UseListSettingsOptions {
  wishlist: Wishlist | null;
  setWishlist: (wishlist: Wishlist | null | ((prev: Wishlist | null) => Wishlist | null)) => void;
  canShowWebSearch: boolean;
}
