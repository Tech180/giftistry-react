import { describe, expect, it } from 'vitest';
import { getTagStackNumber } from './get-tag-stack-number.util';

describe('getTagStackNumber', () => {
  it('returns 1-based stack numbers', () => {
    expect(getTagStackNumber(0)).toBe(1);
    expect(getTagStackNumber(4)).toBe(5);
  });

  it('starts at 1 for the top tag', () => {
    expect(getTagStackNumber(0)).toBe(1);
  });
});
