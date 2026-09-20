import { describe, expect, test } from 'vitest';
import { getClosedMessage } from './get-closed-message.util';

describe('getClosedMessage', () => {
  test('returns disabled message when mode is disabled', () => {
    expect(getClosedMessage('disabled', null)).toBe(
      'Registration is currently disabled on this server.',
    );
  });

  test('returns invite-only message when invite_only and no token', () => {
    expect(getClosedMessage('invite_only', null)).toBe(
      'Registration is invite-only. Use a valid invite link from an administrator.',
    );
  });

  test('returns undefined when invite_only with token', () => {
    expect(getClosedMessage('invite_only', 'token-abc')).toBeUndefined();
  });

  test('returns undefined when open', () => {
    expect(getClosedMessage('open', null)).toBeUndefined();
  });
});
