import { describe, expect, it } from 'vitest';
import {
  USERNAME_EMAIL_MESSAGE,
  USERNAME_POLICY_MESSAGE,
  USERNAME_REQUIRED_MESSAGE,
} from '../constants/username-policy.constant';
import { validateUsername } from './validate-username.util';

describe('validateUsername', () => {
  it('accepts valid usernames', () => {
    expect(validateUsername('gift_user')).toEqual({ ok: true, value: 'gift_user' });
    expect(validateUsername('valid_user-1')).toEqual({ ok: true, value: 'valid_user-1' });
    expect(validateUsername('  abc  ')).toEqual({ ok: true, value: 'abc' });
  });

  it('rejects empty usernames', () => {
    expect(validateUsername('')).toEqual({ ok: false, message: USERNAME_REQUIRED_MESSAGE });
    expect(validateUsername('   ')).toEqual({ ok: false, message: USERNAME_REQUIRED_MESSAGE });
  });

  it('rejects email addresses', () => {
    expect(validateUsername('user@example.com')).toEqual({
      ok: false,
      message: USERNAME_EMAIL_MESSAGE,
    });
    expect(validateUsername('foo@bar')).toEqual({
      ok: false,
      message: USERNAME_EMAIL_MESSAGE,
    });
  });

  it('rejects too-short and invalid charset', () => {
    expect(validateUsername('ab')).toEqual({
      ok: false,
      message: USERNAME_POLICY_MESSAGE,
    });
    expect(validateUsername('bad user')).toEqual({
      ok: false,
      message: USERNAME_POLICY_MESSAGE,
    });
    expect(validateUsername('user!')).toEqual({
      ok: false,
      message: USERNAME_POLICY_MESSAGE,
    });
  });
});
