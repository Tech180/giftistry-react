import { describe, expect, it } from 'vitest';
import { expiresAtIsoToDateInput } from './expires-at-iso-to-date-input.util';
import { dateInputToExpiresAtIso } from './date-input-to-expires-at-iso.util';

describe('expiresAtIsoToDateInput', () => {
  it('returns empty for nullish or invalid values', () => {
    expect(expiresAtIsoToDateInput(null)).toBe('');
    expect(expiresAtIsoToDateInput(undefined)).toBe('');
    expect(expiresAtIsoToDateInput('not-a-date')).toBe('');
  });

  it('round-trips with dateInputToExpiresAtIso on the local calendar day', () => {
    const input = '2030-06-15';
    const iso = dateInputToExpiresAtIso(input);
    expect(iso).not.toBeNull();
    expect(expiresAtIsoToDateInput(iso)).toBe(input);
  });

  it('uses local calendar day, not UTC, for UTC-midnight timestamps', () => {
    // UTC midnight on June 15 is still June 14 evening in US timezones.
    // We assert the local Y-M-D of that instant matches Date local getters.
    const utcMidnight = '2030-06-15T00:00:00.000Z';
    const date = new Date(utcMidnight);
    const expected = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    expect(expiresAtIsoToDateInput(utcMidnight)).toBe(expected);
  });
});
