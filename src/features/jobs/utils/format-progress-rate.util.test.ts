import { describe, expect, test } from 'vitest';
import { formatProgressRate, withRateSuffix } from './format-progress-rate.util';

describe('formatProgressRate', () => {
  test('formats tok/s and items/s', () => {
    expect(formatProgressRate({ Value: 32, Unit: 'tok/s' })).toBe('32 tok/s');
    expect(formatProgressRate({ Value: 1.4, Unit: 'items/s' })).toBe('1.4 items/s');
    expect(formatProgressRate(null)).toBe('');
  });

  test('withRateSuffix appends when present', () => {
    expect(withRateSuffix('Asking AI…', { Value: 32, Unit: 'tok/s' })).toBe(
      'Asking AI… · 32 tok/s'
    );
    expect(withRateSuffix('Asking AI…', null)).toBe('Asking AI…');
  });
});
