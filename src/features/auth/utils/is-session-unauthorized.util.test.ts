import { describe, expect, test } from 'vitest';
import { isSessionUnauthorized } from './is-session-unauthorized.util';

describe('isSessionUnauthorized', () => {
  test('treats missing/expired session messages as session death', () => {
    expect(
      isSessionUnauthorized(401, { Result: { Message: 'Unauthorized: Missing token' } })
    ).toBe(true);
    expect(
      isSessionUnauthorized(401, { Message: 'Unauthorized: Invalid or expired token' })
    ).toBe(true);
    expect(
      isSessionUnauthorized(401, { Result: { Message: 'Unauthorized: User not found' } })
    ).toBe(true);
    expect(
      isSessionUnauthorized(401, { Result: { Message: 'Session expired. Please log in again.' } })
    ).toBe(true);
  });

  test('ignores resource and credential 401s', () => {
    expect(
      isSessionUnauthorized(401, {
        Result: { Message: 'Password is required to access this wishlist' },
      })
    ).toBe(false);
    expect(isSessionUnauthorized(401, { Result: { Message: 'Invalid password' } })).toBe(false);
    expect(
      isSessionUnauthorized(401, { Result: { Message: 'Invalid username or password' } })
    ).toBe(false);
    expect(
      isSessionUnauthorized(401, { Result: { Message: 'Current password is incorrect' } })
    ).toBe(false);
    expect(isSessionUnauthorized(401, { Result: { Message: 'Invalid 2FA code' } })).toBe(false);
    expect(
      isSessionUnauthorized(401, { Result: { Message: 'Authentication required' } })
    ).toBe(false);
  });

  test('ignores non-401 statuses', () => {
    expect(
      isSessionUnauthorized(403, { Result: { Message: 'Unauthorized: Missing token' } })
    ).toBe(false);
    expect(isSessionUnauthorized(200, { Result: { Message: 'ok' } })).toBe(false);
  });
});
