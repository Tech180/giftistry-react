import { describe, expect, test } from 'vitest';
import { isWishlistInArchiveBucket } from './is-wishlist-in-archive-bucket.util';

describe('isWishlistInArchiveBucket', () => {
  test('returns true when IsActive is false', () => {
    expect(
      isWishlistInArchiveBucket({
        IsActive: false,
        ExpiresAt: null,
      })
    ).toBe(true);
  });

  test('returns true when ExpiresAt is in the past', () => {
    expect(
      isWishlistInArchiveBucket({
        IsActive: true,
        ExpiresAt: '2000-01-01T00:00:00.000Z',
      })
    ).toBe(true);
  });

  test('returns false when active with null expiry', () => {
    expect(
      isWishlistInArchiveBucket({
        IsActive: true,
        ExpiresAt: null,
      })
    ).toBe(false);
  });

  test('returns false when active with future expiry', () => {
    expect(
      isWishlistInArchiveBucket({
        IsActive: true,
        ExpiresAt: '2099-01-01T00:00:00.000Z',
      })
    ).toBe(false);
  });

  test('inactive with future expiry is still archived', () => {
    expect(
      isWishlistInArchiveBucket({
        IsActive: false,
        ExpiresAt: '2099-01-01T00:00:00.000Z',
      })
    ).toBe(true);
  });
});
