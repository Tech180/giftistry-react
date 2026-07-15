import { describe, expect, test } from 'vitest';
import { chunkArray } from './chunk-array.util';

describe('chunkArray', () => {
  test('returns empty array for empty input', () => {
    expect(chunkArray([], 500)).toEqual([]);
  });

  test('splits exact multiples evenly', () => {
    expect(chunkArray([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  test('keeps a remainder chunk', () => {
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  test('rejects non-positive chunk size', () => {
    expect(() => chunkArray([1], 0)).toThrow('Chunk size must be greater than 0');
  });
});
