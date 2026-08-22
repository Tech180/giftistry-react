import { describe, expect, it } from 'vitest';
import { shouldPeekCommentTag } from './should-peek-comment-tag.util';

describe('shouldPeekCommentTag', () => {
  it('peeks when comments cover the list on a mobile sheet', () => {
    expect(
      shouldPeekCommentTag({
        isMobileSheet: true,
        isCommentsOpen: true,
        isCommentTaggingActive: false,
      })
    ).toBe(true);
  });

  it('does not peek on desktop', () => {
    expect(
      shouldPeekCommentTag({
        isMobileSheet: false,
        isCommentsOpen: true,
        isCommentTaggingActive: false,
      })
    ).toBe(false);
  });

  it('does not peek when comments are already closed', () => {
    expect(
      shouldPeekCommentTag({
        isMobileSheet: true,
        isCommentsOpen: false,
        isCommentTaggingActive: false,
      })
    ).toBe(false);
  });

  it('does not peek while tagging items from comments', () => {
    expect(
      shouldPeekCommentTag({
        isMobileSheet: true,
        isCommentsOpen: true,
        isCommentTaggingActive: true,
      })
    ).toBe(false);
  });
});
