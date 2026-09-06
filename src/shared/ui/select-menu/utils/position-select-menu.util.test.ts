import { describe, expect, test } from 'vitest';
import { positionSelectMenu } from './position-select-menu.util';

describe('positionSelectMenu', () => {
  test('centers the menu under the trigger', () => {
    const result = positionSelectMenu({
      triggerRect: { top: 100, bottom: 132, left: 200, width: 120 },
      menuWidth: 220,
      menuHeight: 160,
      viewportWidth: 1000,
      viewportHeight: 800,
    });

    expect(result.top).toBe(138);
    expect(result.left).toBe(150);
    expect(result.transformOrigin).toBe('center top');
  });

  test('clamps left edge to inset', () => {
    const result = positionSelectMenu({
      triggerRect: { top: 40, bottom: 72, left: 10, width: 80 },
      menuWidth: 220,
      menuHeight: 120,
      viewportWidth: 400,
      viewportHeight: 600,
      inset: 12,
    });

    expect(result.left).toBe(12);
  });

  test('clamps right edge to inset', () => {
    const result = positionSelectMenu({
      triggerRect: { top: 40, bottom: 72, left: 350, width: 80 },
      menuWidth: 220,
      menuHeight: 120,
      viewportWidth: 400,
      viewportHeight: 600,
      inset: 12,
    });

    expect(result.left).toBe(168);
  });

  test('flips above when there is no room below', () => {
    const result = positionSelectMenu({
      triggerRect: { top: 700, bottom: 732, left: 200, width: 100 },
      menuWidth: 220,
      menuHeight: 180,
      viewportWidth: 1000,
      viewportHeight: 800,
      gap: 6,
      inset: 12,
    });

    expect(result.top).toBe(514);
    expect(result.transformOrigin).toBe('center bottom');
  });
});
