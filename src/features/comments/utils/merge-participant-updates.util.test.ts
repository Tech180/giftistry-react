import { describe, expect, test } from 'vitest';
import { mergeParticipantUpdates } from './merge-participant-updates.util';
import type { ListParticipant } from '../interfaces/list-participant.interface';

describe('mergeParticipantUpdates', () => {
  const base: ListParticipant = {
    userId: 'u1',
    username: 'alice',
    displayName: 'Alice',
    avatar: null,
  };

  test('adds new participants', () => {
    const next = mergeParticipantUpdates([], [
      { userId: 'u2', username: 'bob', displayName: 'Bob', avatar: 'a.png' },
    ]);
    expect(next).toHaveLength(1);
    expect(next[0].userId).toBe('u2');
  });

  test('merges avatar onto existing without wiping username', () => {
    const next = mergeParticipantUpdates([base], [
      { userId: 'u1', username: '', displayName: '', avatar: 'new.png' },
    ]);
    expect(next).toEqual([
      {
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        avatar: 'new.png',
      },
    ]);
  });
});
