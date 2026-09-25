import { describe, expect, test } from 'vitest';
import { measureElement, measureElements, padRect } from './measure-target.util';

describe('measure-target.util', () => {
  test('padRect expands and clamps top/left', () => {
    expect(padRect({ top: 2, left: 2, width: 40, height: 20 }, 8)).toEqual({
      top: 0,
      left: 0,
      width: 56,
      height: 36,
    });
  });

  test('measureElement returns null for missing nodes', () => {
    expect(measureElement(null)).toBeNull();
  });

  test('measureElements unions multiple rects', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    a.getBoundingClientRect = () =>
      ({
        top: 10,
        left: 10,
        width: 40,
        height: 20,
        bottom: 30,
        right: 50,
        x: 10,
        y: 10,
        toJSON: () => ({}),
      }) as DOMRect;
    b.getBoundingClientRect = () =>
      ({
        top: 80,
        left: 20,
        width: 60,
        height: 30,
        bottom: 110,
        right: 80,
        x: 20,
        y: 80,
        toJSON: () => ({}),
      }) as DOMRect;

    expect(measureElements([a, b])).toEqual({
      top: 10,
      left: 10,
      width: 70,
      height: 100,
    });
  });
});
