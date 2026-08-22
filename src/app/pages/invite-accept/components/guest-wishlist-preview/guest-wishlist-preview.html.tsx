import React from 'react';
import { WishlistDetailTemplate } from 'app/pages/wishlist-detail/wishlist-detail.html';
import type { WishlistDetailTemplateProps } from 'app/pages/wishlist-detail/interfaces/wishlist-detail-template-props.interface';

export const GuestWishlistPreviewTemplate: React.FC<WishlistDetailTemplateProps> = (props) => (
  <WishlistDetailTemplate {...props} />
);
