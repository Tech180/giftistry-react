import { describe, expect, it } from 'vitest';
import { mapCropToOutput } from './map-crop-to-output.util';

describe('mapCropToOutput', () => {
  it('scales zoom and offsets by output / ring diameter', () => {
    expect(mapCropToOutput(0.5, 20, -10, 200, 200)).toEqual({
      zoom: 0.5,
      offsetX: 20,
      offsetY: -10,
    });
    expect(mapCropToOutput(0.5, 20, -10, 100, 200)).toEqual({
      zoom: 1,
      offsetX: 40,
      offsetY: -20,
    });
  });
});
