import { describe, expect, it } from 'vitest';
import { isWishlistLocked } from './is-wishlist-locked.util';

describe('isWishlistLocked', () => {
  it('is false when active and not expired', () => {
    expect(isWishlistLocked(false, false)).toBe(false);
  });

  it('is true when expired', () => {
    expect(isWishlistLocked(true, false)).toBe(true);
  });

  it('is true when archived', () => {
    expect(isWishlistLocked(false, true)).toBe(true);
  });

  it('is true when both expired and archived', () => {
    expect(isWishlistLocked(true, true)).toBe(true);
  });
});
