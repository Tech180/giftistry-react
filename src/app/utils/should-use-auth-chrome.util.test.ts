import { describe, expect, it } from 'vitest';
import { shouldUseAuthChrome } from './should-use-auth-chrome.util';

describe('shouldUseAuthChrome', () => {
  it('uses auth chrome on auth paths regardless of auth state', () => {
    for (const path of ['/login', '/register', '/welcome', '/change-password']) {
      expect(shouldUseAuthChrome(path, false)).toBe(true);
      expect(shouldUseAuthChrome(path, true)).toBe(true);
    }
  });

  it('keeps guest chrome on invite paths when logged out', () => {
    expect(shouldUseAuthChrome('/invite/list/abc', false)).toBe(false);
    expect(shouldUseAuthChrome('/invite/list/abc/extra', false)).toBe(false);
  });

  it('uses auth chrome on protected-looking paths when logged out', () => {
    expect(shouldUseAuthChrome('/', false)).toBe(true);
    expect(shouldUseAuthChrome('/dashboard', false)).toBe(true);
    expect(shouldUseAuthChrome('/friends', false)).toBe(true);
    expect(shouldUseAuthChrome('/settings/account', false)).toBe(true);
  });

  it('does not use auth chrome on app paths when logged in', () => {
    expect(shouldUseAuthChrome('/', true)).toBe(false);
    expect(shouldUseAuthChrome('/dashboard', true)).toBe(false);
    expect(shouldUseAuthChrome('/invite/list/abc', true)).toBe(false);
  });
});
