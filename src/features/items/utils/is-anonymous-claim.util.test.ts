import { describe, expect, it } from 'vitest';
import { isAnonymousClaim } from './is-anonymous-claim.util';

describe('isAnonymousClaim', () => {
  it('returns true when Anonymous flag is set', () => {
    expect(
      isAnonymousClaim({ Anonymous: true, ClaimedByName: 'Alice' }),
    ).toBe(true);
  });

  it('returns true when ClaimedByName is Anonymous', () => {
    expect(
      isAnonymousClaim({ Anonymous: false, ClaimedByName: 'Anonymous' }),
    ).toBe(true);
  });

  it('returns false for a named public claim', () => {
    expect(
      isAnonymousClaim({ Anonymous: false, ClaimedByName: 'Alice' }),
    ).toBe(false);
  });
});
