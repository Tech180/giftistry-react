import type { Wishlist } from 'features/wishlists';
import type { PageTemplateProps } from '../../../interfaces/page-template-props.interface';

export interface Props extends Omit<
  PageTemplateProps,
  'isWishlistLoading' | 'wishlistError' | 'wishlist'
> {
  wishlist: Wishlist;
}
