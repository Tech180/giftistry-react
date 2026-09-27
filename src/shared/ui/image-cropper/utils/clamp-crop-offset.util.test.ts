import { describe, expect, it } from 'vitest';
import { clampCropOffset } from './clamp-crop-offset.util';

describe('clampCropOffset', () => {
  it('clamps pan so the ring stays covered', () => {
    expect(clampCropOffset(500, -500, 1000, 1000, 1, 200)).toEqual({ offsetX: 400, offsetY: -400 });
  });

  it('keeps zero when image exactly covers the ring', () => {
    expect(clampCropOffset(10, -10, 200, 200, 1, 200)).toEqual({ offsetX: 0, offsetY: 0 });
  });
});
