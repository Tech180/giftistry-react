import { describe, expect, test } from 'vitest';
import { buildOwnerParticipant } from './build-owner-participant.util';

describe('buildOwnerParticipant', () => {
  test('uses current user avatar when owner is the current user', () => {
    expect(
      buildOwnerParticipant('owner-1', 'owner', 'Owner Name', 'owner-1', 'me.png'),
    ).toEqual({
      userId: 'owner-1',
      username: 'owner',
      displayName: 'Owner Name',
      avatar: 'me.png',
      role: 'owner',
    });
  });

  test('omits avatar when owner is someone else', () => {
    expect(
      buildOwnerParticipant('owner-1', 'owner', undefined, 'other', 'me.png'),
    ).toEqual({
      userId: 'owner-1',
      username: 'owner',
      displayName: 'owner',
      avatar: null,
      role: 'owner',
    });
  });
});
