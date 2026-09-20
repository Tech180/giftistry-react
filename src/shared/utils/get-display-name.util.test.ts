import { describe, expect, test } from 'vitest';
import { getDisplayName } from './get-display-name.util';

describe('getDisplayName', () => {
  test('prefers trimmed first and last name', () => {
    expect(getDisplayName({ FirstName: ' Ada ', LastName: ' Lovelace ', Username: 'ada' })).toBe(
      'Ada Lovelace',
    );
    expect(getDisplayName({ FirstName: '', LastName: 'Lovelace', Username: 'ada' })).toBe('Lovelace');
  });

  test('falls back to username then email', () => {
    expect(getDisplayName({ FirstName: '', LastName: '', Username: 'ada', Email: 'a@b.c' })).toBe(
      'ada',
    );
    expect(getDisplayName({ Username: '  ', Email: ' a@b.c ' })).toBe('a@b.c');
  });

  test('returns fallback for nullish or empty fields', () => {
    expect(getDisplayName(null)).toBe('User');
    expect(getDisplayName(undefined)).toBe('User');
    expect(getDisplayName({})).toBe('User');
    expect(getDisplayName({}, 'Guest')).toBe('Guest');
  });
});
