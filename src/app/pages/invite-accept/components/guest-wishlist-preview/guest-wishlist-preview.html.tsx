import React from 'react';
import { PageTemplate } from 'app/pages/wishlist-detail/page.html';
import type { PageTemplateProps } from 'app/pages/wishlist-detail/interfaces/page-template-props.interface';

export const GuestWishlistPreviewTemplate: React.FC<PageTemplateProps> = (props) => (
  <PageTemplate {...props} />
);
