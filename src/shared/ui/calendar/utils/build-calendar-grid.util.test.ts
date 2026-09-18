import { describe, expect, it } from 'vitest';
import { buildCalendarGrid } from './build-calendar-grid.util';
import { formatDateKey } from './format-date-key.util';
import { isSameCalendarDay } from './is-same-calendar-day.util';
import { parseDateKey } from './parse-date-key.util';

describe('formatDateKey / parseDateKey', () => {
  it('round-trips a local calendar day', () => {
    const key = formatDateKey(new Date(2026, 5, 15));
    expect(key).toBe('2026-06-15');
    const parsed = parseDateKey(key);
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(5);
    expect(parsed?.getDate()).toBe(15);
  });

  it('returns null for invalid keys', () => {
    expect(parseDateKey('')).toBeNull();
    expect(parseDateKey('2026-13-01')).toBeNull();
    expect(parseDateKey('not-a-date')).toBeNull();
  });
});

describe('isSameCalendarDay', () => {
  it('compares local calendar days', () => {
    expect(isSameCalendarDay(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(true);
    expect(isSameCalendarDay(new Date(2026, 0, 1), new Date(2026, 0, 2))).toBe(false);
    expect(isSameCalendarDay(null, new Date())).toBe(false);
  });
});

describe('buildCalendarGrid', () => {
  it('builds a complete Sunday-start grid for June 2026', () => {
    const today = new Date(2026, 5, 10);
    const cells = buildCalendarGrid(new Date(2026, 5, 1), today);
    expect(cells.length % 7).toBe(0);
    expect(cells.some((cell) => cell.dateKey === '2026-06-01' && cell.isCurrentMonth)).toBe(true);
    expect(cells.some((cell) => cell.dateKey === '2026-06-10' && cell.isToday)).toBe(true);
    expect(cells[0]?.isCurrentMonth).toBe(false);
  });
});
