import type { Wishlist } from 'features/wishlists';

export interface DashboardCard {
  wishlist: Wishlist;
  isArchived: boolean;
}
