import { describe, expect, it } from 'vitest';
import { coverMinZoom } from './cover-min-zoom.util';

describe('coverMinZoom', () => {
  it('returns cover scale for landscape image', () => {
    expect(coverMinZoom(4000, 2000, 200)).toBe(0.1);
  });

  it('returns 1 for invalid dims', () => {
    expect(coverMinZoom(0, 100, 200)).toBe(1);
  });
});
