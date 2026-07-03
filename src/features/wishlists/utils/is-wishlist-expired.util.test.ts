import { describe, expect, test } from 'vitest';
import { isWishlistExpired } from './is-wishlist-expired.util';

describe('isWishlistExpired', () => {
  test('returns false when no expiration date', () => {
    expect(isWishlistExpired(null)).toBe(false);
    expect(isWishlistExpired(undefined)).toBe(false);
  });

  test('returns true for past dates', () => {
    expect(isWishlistExpired('2000-01-01T00:00:00.000Z')).toBe(true);
  });

  test('returns false for future dates', () => {
    expect(isWishlistExpired('2099-01-01T00:00:00.000Z')).toBe(false);
  });
});
