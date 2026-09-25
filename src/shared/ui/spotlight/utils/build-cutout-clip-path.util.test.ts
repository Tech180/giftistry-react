import { describe, expect, test } from 'vitest';
import { buildCutoutClipPath } from './build-cutout-clip-path.util';

describe('buildCutoutClipPath', () => {
  test('builds an evenodd path that punches one or more holes', () => {
    expect(
      buildCutoutClipPath(
        [
          { top: 10, left: 20, width: 40, height: 30 },
          { top: 200, left: 50, width: 80, height: 36 },
        ],
        1000,
        800
      )
    ).toBe(
      'path(evenodd, "M0 0H1000V800H0ZM20 10H60V40H20ZM50 200H130V236H50Z")'
    );
  });
});
