import { describe, expect, test } from 'vitest';
import { parseCommentVisibilityMode } from './parse-comment-visibility-mode.util';

describe('parseCommentVisibilityMode', () => {
  test('returns visibleToSelected when VisibleToUserIds is non-empty', () => {
    expect(
      parseCommentVisibilityMode({
        IsOwnerVisible: true,
        VisibleToUserIds: ['u1'],
      }),
    ).toBe('visibleToSelected');
  });

  test('returns hiddenFromOwner when IsOwnerVisible is false', () => {
    expect(
      parseCommentVisibilityMode({
        IsOwnerVisible: false,
        VisibleToUserIds: null,
      }),
    ).toBe('hiddenFromOwner');
  });

  test('returns visibleToAll by default', () => {
    expect(
      parseCommentVisibilityMode({
        IsOwnerVisible: true,
      }),
    ).toBe('visibleToAll');
  });
});
