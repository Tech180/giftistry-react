import { describe, expect, test } from 'vitest';
import { parsePresenceUsers } from './parse-presence-users.util';

describe('parsePresenceUsers', () => {
  test('returns empty array for non-arrays', () => {
    expect(parsePresenceUsers(null)).toEqual([]);
    expect(parsePresenceUsers(undefined)).toEqual([]);
    expect(parsePresenceUsers('x')).toEqual([]);
  });

  test('maps string entries', () => {
    expect(parsePresenceUsers(['u1', 'u2'])).toEqual([
      { userId: 'u1', username: 'u1' },
      { userId: 'u2', username: 'u2' },
    ]);
  });

  test('maps object entries', () => {
    expect(
      parsePresenceUsers([
        { UserId: 'u1', Username: 'alice' },
        { UserId: 'u2' },
      ]),
    ).toEqual([
      { userId: 'u1', username: 'alice' },
      { userId: 'u2', username: 'u2' },
    ]);
  });
});
