import { describe, expect, test } from 'vitest';
import {
  formatElapsedSuffix,
  withFoundStepElapsed,
} from './with-found-step-elapsed.util';

describe('withFoundStepElapsed', () => {
  test('formatElapsedSuffix skips sub-second values', () => {
    expect(formatElapsedSuffix(0)).toBe('');
    expect(formatElapsedSuffix(0.4)).toBe('');
    expect(formatElapsedSuffix(3)).toBe(' · 3s');
  });

  test('appends elapsed only to the active found step metric', () => {
    const steps = withFoundStepElapsed(
      [
        { id: 'upload', label: 'Upload', tone: 'done' },
        { id: 'found', label: 'Asking AI…', metric: '12 tok/s', tone: 'active' },
        { id: 'created', label: 'Created wishlist', tone: 'pending' },
      ],
      24
    );
    expect(steps.find((s) => s.id === 'found')?.label).toBe('Asking AI…');
    expect(steps.find((s) => s.id === 'found')?.metric).toBe('12 tok/s · 24s');
    expect(steps.find((s) => s.id === 'created')?.label).toBe('Created wishlist');
  });
});
