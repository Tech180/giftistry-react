import { describe, expect, it } from 'vitest';
import { chunkLoadingMessage } from './chunk-loading-message.util';

describe('chunkLoadingMessage', () => {
  it('maps wishlist paths', () => {
    expect(chunkLoadingMessage('/wishlists/abc')).toBe('Loading list...');
  });

  it('maps invite paths', () => {
    expect(chunkLoadingMessage('/invite/list/token')).toBe('Checking invite link...');
  });

  it('maps user profile paths', () => {
    expect(chunkLoadingMessage('/users/u1')).toBe('Loading profile...');
  });

  it('defaults for other paths', () => {
    expect(chunkLoadingMessage('/dashboard')).toBe('Loading...');
    expect(chunkLoadingMessage('/login')).toBe('Loading...');
  });
});
