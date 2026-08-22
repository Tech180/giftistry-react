import { describe, expect, it } from 'vitest';
import { dateInputToExpiresAtIso } from './date-input-to-expires-at-iso.util';

describe('dateInputToExpiresAtIso', () => {
  it('returns null for empty input', () => {
    expect(dateInputToExpiresAtIso('')).toBeNull();
    expect(dateInputToExpiresAtIso('   ')).toBeNull();
  });

  it('maps YYYY-MM-DD to local end of day', () => {
    const iso = dateInputToExpiresAtIso('2030-06-15');
    expect(iso).not.toBeNull();
    const date = new Date(iso!);
    expect(date.getFullYear()).toBe(2030);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(15);
    expect(date.getHours()).toBe(23);
    expect(date.getMinutes()).toBe(59);
  });
});
