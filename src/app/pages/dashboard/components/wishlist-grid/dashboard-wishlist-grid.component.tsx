import React from 'react';
import type { DashboardWishlistGridProps } from './interfaces/dashboard-wishlist-grid-props.interface';
import { DashboardWishlistGridTemplate } from './dashboard-wishlist-grid.html';

export const DashboardWishlistGrid: React.FC<DashboardWishlistGridProps> = (props) => (
  <DashboardWishlistGridTemplate {...props} />
);
