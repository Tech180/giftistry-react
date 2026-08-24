import type { Wishlist } from '../interfaces/wishlist.interface';
import { isWishlistExpired } from './is-wishlist-expired.util';

/**
 * True when the list belongs in the dashboard Archived tab
 * (inactive or past expiry) — mirrors backend classifyBucket.
 */
export function isWishlistInArchiveBucket(
  wishlist: Pick<Wishlist, 'IsActive' | 'ExpiresAt'>
): boolean {
  return wishlist.IsActive === false || isWishlistExpired(wishlist.ExpiresAt);
}
