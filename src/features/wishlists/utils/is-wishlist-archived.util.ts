/** True when the wishlist has been deactivated (archived). */
export function isWishlistArchived(isActive: boolean | null | undefined): boolean {
  return isActive === false;
}
