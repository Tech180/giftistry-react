import type { Item } from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';
import type { PublicLinkPreviewWishlist } from './public-link-preview-wishlist.interface';

export interface PublicLinkPreview {
  Wishlist: PublicLinkPreviewWishlist;
  Items: Item[];
  Groups: ItemListGroup[];
}
