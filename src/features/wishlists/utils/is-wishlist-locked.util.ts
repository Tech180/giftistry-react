/** True when the wishlist should be treated as read-only for item mutations. */
export function isWishlistLocked(isExpired: boolean, isArchived: boolean): boolean {
  return isExpired || isArchived;
}
