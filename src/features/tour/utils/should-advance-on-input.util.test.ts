import { describe, expect, it } from 'vitest';
import { shouldAdvanceOnInputValue } from './should-advance-on-input.util';

describe('shouldAdvanceOnInputValue', () => {
  it('advances when the value has non-whitespace content', () => {
    expect(shouldAdvanceOnInputValue('Birthday')).toBe(true);
    expect(shouldAdvanceOnInputValue('  list  ')).toBe(true);
  });

  it('does not advance on empty or whitespace-only values', () => {
    expect(shouldAdvanceOnInputValue('')).toBe(false);
    expect(shouldAdvanceOnInputValue('   ')).toBe(false);
    expect(shouldAdvanceOnInputValue(null)).toBe(false);
    expect(shouldAdvanceOnInputValue(undefined)).toBe(false);
  });
});
