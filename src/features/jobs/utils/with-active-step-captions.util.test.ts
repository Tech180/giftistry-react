import { describe, expect, test } from 'vitest';
import {
  formatElapsedSuffix,
  withActiveStepCaptions,
  withFoundStepElapsed,
} from './with-active-step-captions.util';

describe('withActiveStepCaptions', () => {
  test('formatElapsedSuffix skips sub-second values', () => {
    expect(formatElapsedSuffix(0)).toBe('');
    expect(formatElapsedSuffix(0.4)).toBe('');
    expect(formatElapsedSuffix(3)).toBe(' · 3s');
  });

  test('appends elapsed to found and grabInfo active step metrics', () => {
    const steps = withActiveStepCaptions(
      [
        { id: 'upload', label: 'Upload', tone: 'done' },
        { id: 'found', label: 'Asking AI…', metric: '12 tok/s', tone: 'active' },
        {
          id: 'grabInfo',
          label: 'Grab info',
          metric: '3/12 · 1.4 items/s',
          tone: 'active',
        },
        { id: 'created', label: 'Created wishlist', tone: 'pending' },
      ],
      { stepIds: ['found', 'grabInfo'], elapsedSeconds: 24 }
    );
    expect(steps.find((s) => s.id === 'found')?.label).toBe('Asking AI…');
    expect(steps.find((s) => s.id === 'found')?.metric).toBe('12 tok/s · 24s');
    expect(steps.find((s) => s.id === 'grabInfo')?.label).toBe('Grab info');
    expect(steps.find((s) => s.id === 'grabInfo')?.metric).toBe(
      '3/12 · 1.4 items/s · 24s'
    );
    expect(steps.find((s) => s.id === 'created')?.label).toBe('Created wishlist');
  });

  test('sets elapsed as metric when no rate is present', () => {
    const steps = withActiveStepCaptions(
      [{ id: 'found', label: 'Finding items…', tone: 'active' }],
      { stepIds: ['found'], elapsedSeconds: 5 }
    );
    expect(steps.find((s) => s.id === 'found')?.metric).toBe('5s');
  });

  test('withFoundStepElapsed still targets only found', () => {
    const steps = withFoundStepElapsed(
      [
        { id: 'found', label: 'Asking AI…', metric: '12 tok/s', tone: 'active' },
        { id: 'grabInfo', label: 'Grab info', metric: '3/12', tone: 'active' },
      ],
      24
    );
    expect(steps.find((s) => s.id === 'found')?.metric).toBe('12 tok/s · 24s');
    expect(steps.find((s) => s.id === 'grabInfo')?.metric).toBe('3/12');
  });
});
