import { describe, expect, test } from 'vitest';
import type { ApiUser } from 'features/auth';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { getJoinedLabel } from './get-joined-label.util';

const baseUser = {
  Id: '1',
  Username: 'ada',
  FirstName: 'Ada',
  LastName: 'Lovelace',
} as ApiUser;

describe('user-profile getDisplayName', () => {
  test('prefers first and last name', () => {
    expect(getDisplayName(baseUser)).toBe('Ada Lovelace');
  });

  test('falls back to username then User', () => {
    expect(getDisplayName({ ...baseUser, FirstName: '', LastName: '' })).toBe('ada');
    expect(getDisplayName({ ...baseUser, FirstName: '', LastName: '', Username: '' })).toBe('User');
    expect(getDisplayName(null)).toBe('User');
  });
});

describe('user-profile getJoinedLabel', () => {
  test('strips Joined prefix when present', () => {
    expect(getJoinedLabel('Joined Jan 2024')).toBe('Jan 2024');
    expect(getJoinedLabel('Unknown')).toBe('Unknown');
  });
});
