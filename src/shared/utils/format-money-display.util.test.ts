import { describe, expect, it } from 'vitest';
import {
  formatMoneyAmount,
  formatMoneyFromUnknown,
  formatUsd,
  formatUsdOrFallback,
} from './format-money-display.util';

describe('formatMoneyAmount', () => {
  it('always uses two fractional digits', () => {
    expect(formatMoneyAmount(15)).toBe('15.00');
    expect(formatMoneyAmount(12.5)).toBe('12.50');
    expect(formatMoneyAmount(49.99)).toBe('49.99');
  });
});

describe('formatUsd', () => {
  it('prefixes dollar sign', () => {
    expect(formatUsd(15)).toBe('$15.00');
  });
});

describe('formatUsdOrFallback', () => {
  it('returns fallback for nullish', () => {
    expect(formatUsdOrFallback(null)).toBe('\u2014');
    expect(formatUsdOrFallback(undefined, '—')).toBe('—');
  });

  it('formats finite amounts', () => {
    expect(formatUsdOrFallback(15)).toBe('$15.00');
  });
});

describe('formatMoneyFromUnknown', () => {
  it('handles strings and numbers', () => {
    expect(formatMoneyFromUnknown(15)).toBe('15.00');
    expect(formatMoneyFromUnknown('15')).toBe('15.00');
    expect(formatMoneyFromUnknown('  12.5 ')).toBe('12.50');
  });

  it('returns fallback for empty or invalid', () => {
    expect(formatMoneyFromUnknown(null)).toBe('');
    expect(formatMoneyFromUnknown('')).toBe('');
    expect(formatMoneyFromUnknown('abc', '—')).toBe('—');
  });
});
