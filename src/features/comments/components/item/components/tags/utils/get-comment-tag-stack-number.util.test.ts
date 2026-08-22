import { describe, expect, it } from 'vitest';
import { getCommentTagStackNumber } from './get-comment-tag-stack-number.util';

describe('getCommentTagStackNumber', () => {
  it('numbers five tags from 1 at the top to 5 at the bottom', () => {
    expect(getCommentTagStackNumber(0)).toBe(1);
    expect(getCommentTagStackNumber(4)).toBe(5);
  });

  it('numbers a single tag as 1', () => {
    expect(getCommentTagStackNumber(0)).toBe(1);
  });
});
