import { describe, expect, it } from 'vitest';
import { postAuthPath } from './post-auth-path.util';

describe('postAuthPath', () => {
  it('sends forced password users to change-password first', () => {
    expect(postAuthPath({ ForcePasswordChange: true, IsOnboarded: false })).toBe('/change-password');
    expect(postAuthPath({ ForcePasswordChange: true, IsOnboarded: true })).toBe('/change-password');
  });

  it('sends incomplete onboarding to welcome', () => {
    expect(postAuthPath({ ForcePasswordChange: false, IsOnboarded: false })).toBe('/welcome');
  });

  it('sends completed users to dashboard', () => {
    expect(postAuthPath({ ForcePasswordChange: false, IsOnboarded: true })).toBe('/dashboard');
    expect(postAuthPath({})).toBe('/dashboard');
    expect(postAuthPath(null)).toBe('/dashboard');
  });
});
