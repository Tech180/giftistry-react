import { describe, expect, test } from 'vitest';
import { computeAnchoredPopoverPosition } from './compute-anchored-popover-position.util';

const baseInput = {
  popoverWidth: 320,
  gap: 8,
  viewportPadding: 12,
  viewportWidth: 800,
  viewportHeight: 600,
};

describe('computeAnchoredPopoverPosition', () => {
  test('places below anchor when enough space', () => {
    const result = computeAnchoredPopoverPosition({
      ...baseInput,
      anchorRect: { top: 100, bottom: 140, left: 40 },
      popoverHeight: 200,
    });

    expect(result.placement).toBe('below');
    expect(result.top).toBe(148);
    expect(result.constrainMaxHeight).toBe(false);
  });

  test('caps tall popover when content exceeds available space', () => {
    const result = computeAnchoredPopoverPosition({
      ...baseInput,
      anchorRect: { top: 520, bottom: 560, left: 40 },
      popoverHeight: 520,
    });

    expect(result.placement).toBe('above');
    expect(result.constrainMaxHeight).toBe(true);
    expect(result.top + Math.min(520, result.maxHeight)).toBeLessThanOrEqual(588);
    expect(result.top).toBeGreaterThanOrEqual(12);
  });

  test('places above anchor when below space is tight', () => {
    const result = computeAnchoredPopoverPosition({
      ...baseInput,
      anchorRect: { top: 520, bottom: 560, left: 40 },
      popoverHeight: 120,
    });

    expect(result.placement).toBe('above');
    expect(result.top).toBeGreaterThanOrEqual(12);
  });

  test('clamps horizontal position inside viewport', () => {
    const result = computeAnchoredPopoverPosition({
      ...baseInput,
      anchorRect: { top: 100, bottom: 140, left: 700 },
      popoverHeight: 160,
    });

    expect(result.left).toBe(800 - 320 - 12);
  });
});
