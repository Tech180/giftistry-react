import { describe, expect, test } from 'vitest';
import { isWishlistArchived } from './is-wishlist-archived.util';

describe('isWishlistArchived', () => {
  test('returns true only when IsActive is false', () => {
    expect(isWishlistArchived(false)).toBe(true);
  });

  test('returns false when active or unknown', () => {
    expect(isWishlistArchived(true)).toBe(false);
    expect(isWishlistArchived(null)).toBe(false);
    expect(isWishlistArchived(undefined)).toBe(false);
  });
});
