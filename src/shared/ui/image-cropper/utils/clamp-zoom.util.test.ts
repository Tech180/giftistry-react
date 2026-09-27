import { describe, expect, it } from 'vitest';
import { clampZoom } from './clamp-zoom.util';

describe('clampZoom', () => {
  it('clamps within bounds', () => {
    expect(clampZoom(0.01, 0.1, 0.4)).toBe(0.1);
    expect(clampZoom(0.9, 0.1, 0.4)).toBe(0.4);
    expect(clampZoom(0.2, 0.1, 0.4)).toBe(0.2);
  });
});
