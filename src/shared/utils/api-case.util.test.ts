import { describe, it, expect } from 'vitest';
import { camelcaseKeys } from './api-case.util';

describe('camelcaseKeys', () => {
  it('converts top-level PascalCase keys to camelCase', () => {
    const input = { Challenge: 'abc', RpId: 'localhost' };
    const expected = { challenge: 'abc', rpId: 'localhost' };
    expect(camelcaseKeys(input)).toEqual(expected);
  });

  it('converts nested PascalCase keys recursively', () => {
    const input = {
      Rp: { Name: 'Giftistry', Id: 'localhost' },
      User: { Id: '123', Name: 'user@giftistry.app', DisplayName: 'User' },
      PubKeyCredParams: [
        { Type: 'public-key', Alg: -7 },
      ],
    };
    const expected = {
      rp: { name: 'Giftistry', id: 'localhost' },
      user: { id: '123', name: 'user@giftistry.app', displayName: 'User' },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },
      ],
    };
    expect(camelcaseKeys(input)).toEqual(expected);
  });

  it('leaves null, undefined, dates and non-objects unchanged', () => {
    expect(camelcaseKeys(null)).toBeNull();
    expect(camelcaseKeys(undefined)).toBeUndefined();
    expect(camelcaseKeys('string')).toBe('string');
    expect(camelcaseKeys(123)).toBe(123);
    const date = new Date();
    expect(camelcaseKeys(date)).toBe(date);
  });
});
