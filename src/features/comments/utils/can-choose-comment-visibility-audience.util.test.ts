import { describe, expect, test } from 'vitest';
import type { ListParticipant } from '../interfaces/list-participant.interface';
import { canChooseCommentVisibilityAudience } from './can-choose-comment-visibility-audience.util';

const participant = (userId: string): ListParticipant => ({
  userId,
  username: userId,
  displayName: userId,
});

describe('canChooseCommentVisibilityAudience', () => {
  test('owner needs more than one other participant', () => {
    expect(
      canChooseCommentVisibilityAudience({
        participants: [participant('owner')],
        currentUserId: 'owner',
        isOwner: true,
      })
    ).toBe(false);

    expect(
      canChooseCommentVisibilityAudience({
        participants: [participant('owner'), participant('guest')],
        currentUserId: 'owner',
        isOwner: true,
      })
    ).toBe(false);

    expect(
      canChooseCommentVisibilityAudience({
        participants: [participant('owner'), participant('a'), participant('b')],
        currentUserId: 'owner',
        isOwner: true,
      })
    ).toBe(true);
  });

  test('non-owner is always allowed regardless of count', () => {
    expect(
      canChooseCommentVisibilityAudience({
        participants: [participant('owner')],
        currentUserId: 'guest',
        isOwner: false,
      })
    ).toBe(true);

    expect(
      canChooseCommentVisibilityAudience({
        participants: [participant('owner'), participant('guest')],
        currentUserId: 'guest',
        isOwner: false,
      })
    ).toBe(true);
  });
});
