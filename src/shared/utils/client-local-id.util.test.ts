import { describe, expect, test, vi, afterEach } from 'vitest';
import { createClientLocalId } from './client-local-id.util';

describe('createClientLocalId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('returns prefixed unique ids when randomUUID is available', () => {
    const a = createClientLocalId('photo');
    const b = createClientLocalId('photo');
    expect(a.startsWith('photo-')).toBe(true);
    expect(b.startsWith('photo-')).toBe(true);
    expect(a).not.toBe(b);
  });

  test('falls back without throwing when randomUUID is missing', () => {
    const original = globalThis.crypto;
    vi.stubGlobal('crypto', {
      getRandomValues: original?.getRandomValues?.bind(original),
    });

    const a = createClientLocalId('photo');
    const b = createClientLocalId('photo');
    expect(a.startsWith('photo-')).toBe(true);
    expect(b.startsWith('photo-')).toBe(true);
    expect(a).not.toBe(b);
  });
});
