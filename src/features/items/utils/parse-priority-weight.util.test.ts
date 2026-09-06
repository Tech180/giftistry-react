import { describe, expect, test } from 'vitest';
import {
  PRIORITY_WEIGHT_INFINITY,
  decodePrioritySelectorValue,
  encodePrioritySelectorValue,
  parsePriorityWeight,
} from './parse-priority-weight.util';

describe('parse-priority-weight', () => {
  test('encodes unset as dash value 0 and infinity as -1', () => {
    expect(encodePrioritySelectorValue('')).toBe(0);
    expect(encodePrioritySelectorValue(PRIORITY_WEIGHT_INFINITY)).toBe(-1);
    expect(encodePrioritySelectorValue('3')).toBe(3);
  });

  test('decodes selector values back to form weight', () => {
    expect(decodePrioritySelectorValue(0)).toBe('');
    expect(decodePrioritySelectorValue(-1)).toBe(PRIORITY_WEIGHT_INFINITY);
    expect(decodePrioritySelectorValue(2)).toBe('2');
  });

  test('parses API priority from form weight', () => {
    expect(parsePriorityWeight('')).toBeNull();
    expect(parsePriorityWeight(PRIORITY_WEIGHT_INFINITY)).toBeNull();
    expect(parsePriorityWeight('4')).toBe(4);
    expect(parsePriorityWeight('0')).toBeNull();
  });
});
