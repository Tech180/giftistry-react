import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  formatBirthday,
  formatDateTime,
  formatRelativePast,
  getOnlineStatus,
} from './format-date.util';

describe('formatDateTime', () => {
  test('returns empty fallback for missing or invalid values', () => {
    expect(formatDateTime(undefined)).toBe('—');
    expect(formatDateTime(null, 'Never')).toBe('Never');
    expect(formatDateTime('not-a-date', '—')).toBe('—');
  });

  test('formats a valid ISO timestamp', () => {
    const result = formatDateTime('2026-06-15T14:30:00.000Z');
    expect(result).not.toBe('—');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('formatBirthday', () => {
  test('returns empty string for missing values', () => {
    expect(formatBirthday()).toBe('');
    expect(formatBirthday(null)).toBe('');
    expect(formatBirthday('')).toBe('');
  });

  test('formats YYYY-MM-DD without UTC day shift', () => {
    expect(formatBirthday('2000-01-01')).toMatch(/Jan 1/);
    expect(formatBirthday('2026-06-15')).toMatch(/Jun 15/);
  });

  test('returns empty string for invalid values', () => {
    expect(formatBirthday('not-a-date')).toBe('');
  });
});

describe('formatRelativePast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns Just now under the just-now threshold', () => {
    expect(formatRelativePast('2026-06-15T11:59:30.000Z')).toBe('Just now');
  });

  test('formats minutes, hours, and days', () => {
    expect(formatRelativePast('2026-06-15T11:45:00.000Z')).toBe('15m ago');
    expect(formatRelativePast('2026-06-15T09:00:00.000Z')).toBe('3h ago');
    expect(formatRelativePast('2026-06-13T12:00:00.000Z')).toBe('2d ago');
  });

  test('formats older dates by olderStyle', () => {
    const older = '2026-05-01T12:00:00.000Z';
    expect(formatRelativePast(older, { olderStyle: 'monthDay' })).toMatch(/May 1/);
    expect(formatRelativePast(older, { olderStyle: 'localeDate' })).toBe(
      new Date(older).toLocaleDateString()
    );
  });

  test('skips Just now when justNowUnderMinutes is 0', () => {
    expect(
      formatRelativePast('2026-06-15T11:59:00.000Z', { justNowUnderMinutes: 0 })
    ).toBe('1m ago');
  });
});

describe('getOnlineStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns Online within the 5-minute threshold', () => {
    expect(getOnlineStatus('2026-06-15T11:56:00.000Z')).toEqual({
      isOnline: true,
      statusText: 'Online',
    });
  });

  test('returns Offline with relative text after 5 minutes', () => {
    expect(getOnlineStatus('2026-06-15T11:50:00.000Z')).toEqual({
      isOnline: false,
      statusText: '10m ago',
    });
  });

  test('returns Offline for missing or invalid values', () => {
    expect(getOnlineStatus()).toEqual({ isOnline: false, statusText: 'Offline' });
    expect(getOnlineStatus('bad')).toEqual({ isOnline: false, statusText: 'Offline' });
  });
});
