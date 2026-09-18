import { describe, expect, it } from 'vitest';
import { resolveCommentVisibilityPayload } from './resolve-comment-visibility-payload.util';
import { parseCommentVisibilityMode } from './parse-comment-visibility-mode.util';

describe('resolveCommentVisibilityPayload', () => {
  it('maps hiddenFromOwner for non-owners', () => {
    expect(
      resolveCommentVisibilityPayload(
        { mode: 'hiddenFromOwner', selectedUserIds: [] },
        false
      )
    ).toEqual({ isOwnerVisible: false, visibleToUserIds: null });
  });

  it('forces owner-visible when owner requests hidden', () => {
    expect(
      resolveCommentVisibilityPayload(
        { mode: 'hiddenFromOwner', selectedUserIds: [] },
        true
      )
    ).toEqual({ isOwnerVisible: true, visibleToUserIds: null });
  });

  it('maps selected audience', () => {
    expect(
      resolveCommentVisibilityPayload(
        { mode: 'visibleToSelected', selectedUserIds: ['a', 'b', 'a'] },
        false
      )
    ).toEqual({ isOwnerVisible: true, visibleToUserIds: ['a', 'b'] });
  });
});

describe('parseCommentVisibilityMode', () => {
  it('parses legacy and selected comments', () => {
    expect(parseCommentVisibilityMode({ IsOwnerVisible: false })).toBe('hiddenFromOwner');
    expect(parseCommentVisibilityMode({ IsOwnerVisible: true })).toBe('visibleToAll');
    expect(
      parseCommentVisibilityMode({
        IsOwnerVisible: true,
        VisibleToUserIds: ['u1'],
      })
    ).toBe('visibleToSelected');
  });
});
