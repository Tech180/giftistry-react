import { Wishlist } from './wishlist.interface';

export interface WishlistCardTemplateProps {
  wishlist: Wishlist;
  isOwner: boolean;
  formattedDate: string;
  expirationClass: string;
  isArchived: boolean;
  isPersonalShared: boolean;
  ownerAvatarClass: string;
}
