import type { Item } from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';
import type { PublicLinkPreviewWishlist } from 'features/wishlists/interfaces/public-link-preview-wishlist.interface';

export interface GuestWishlistPreviewProps {
  wishlist: PublicLinkPreviewWishlist;
  items: Item[];
  groups?: ItemListGroup[];
}
