import { describe, expect, test } from 'vitest';
import { resolveCardPosition } from './resolve-card-position.util';

const viewport = { width: 800, height: 600 };
const card = { width: 320, height: 160 };

describe('resolveCardPosition', () => {
  test('places below a mid-screen hole', () => {
    const hole = { top: 100, left: 200, width: 120, height: 40 };
    const result = resolveCardPosition(hole, 'bottom', card, viewport);
    expect(result.placement).toBe('bottom');
    expect(result.top).toBe(100 + 40 + 12);
    expect(result.left).toBeGreaterThanOrEqual(16);
    expect(result.left + card.width).toBeLessThanOrEqual(viewport.width - 16);
  });

  test('flips to top when bottom would leave the viewport', () => {
    const hole = { top: 500, left: 200, width: 120, height: 40 };
    const result = resolveCardPosition(hole, 'bottom', card, viewport);
    expect(result.placement).toBe('top');
    expect(result.top + card.height).toBeLessThanOrEqual(hole.top);
  });

  test('centers within the viewport', () => {
    const hole = { top: 0, left: 0, width: 1, height: 1 };
    const result = resolveCardPosition(hole, 'center', card, viewport);
    expect(result.placement).toBe('center');
    expect(result.top).toBe((600 - 160) / 2);
    expect(result.left).toBe((800 - 320) / 2);
  });
});
