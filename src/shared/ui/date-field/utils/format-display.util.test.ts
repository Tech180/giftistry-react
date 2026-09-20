import { describe, expect, it } from 'vitest';
import {
  formatDateFieldDisplay,
  formatDateFieldEditValue,
} from './format-display.util';
import { parseDateFieldInput } from './parse-input.util';
import { resolveDateFieldQuickPick } from './resolve-quick-pick.util';

describe('formatDateFieldDisplay', () => {
  it('returns empty placeholder by default when empty', () => {
    expect(formatDateFieldDisplay('')).toBe('');
    expect(formatDateFieldDisplay(null, 'Select date...')).toBe('Select date...');
  });

  it('formats a valid date key in a short readable form', () => {
    expect(formatDateFieldDisplay('2026-06-15')).toMatch(/Jun 15, 2026/);
    expect(formatDateFieldDisplay('2000-01-01')).toMatch(/Jan 1, 2000/);
  });
});

describe('formatDateFieldEditValue', () => {
  it('formats a valid date key as MM/DD/YYYY', () => {
    expect(formatDateFieldEditValue('2026-06-15')).toBe('06/15/2026');
    expect(formatDateFieldEditValue('2000-01-01')).toBe('01/01/2000');
    expect(formatDateFieldEditValue('')).toBe('');
  });
});

describe('parseDateFieldInput', () => {
  it('parses zero-padded and unpadded dates', () => {
    expect(parseDateFieldInput('01/01/2000')).toBe('2000-01-01');
    expect(parseDateFieldInput('6/15/2026')).toBe('2026-06-15');
  });

  it('returns null for empty or invalid input', () => {
    expect(parseDateFieldInput('')).toBeNull();
    expect(parseDateFieldInput('13/01/2000')).toBeNull();
    expect(parseDateFieldInput('02/30/2000')).toBeNull();
    expect(parseDateFieldInput('not-a-date')).toBeNull();
  });
});

describe('resolveDateFieldQuickPick', () => {
  const now = new Date(2026, 5, 10);

  it('resolves today / tomorrow / next week / next month', () => {
    expect(resolveDateFieldQuickPick('today', now)).toBe('2026-06-10');
    expect(resolveDateFieldQuickPick('tomorrow', now)).toBe('2026-06-11');
    expect(resolveDateFieldQuickPick('next-week', now)).toBe('2026-06-17');
    expect(resolveDateFieldQuickPick('next-month', now)).toBe('2026-07-10');
  });
});
