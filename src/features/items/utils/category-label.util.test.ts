import { describe, expect, test } from 'vitest';
import { normalizeCategoryLabel } from './category-label.util';

describe('normalizeCategoryLabel', () => {
  test('normalizes labels for grouping keys', () => {
    expect(normalizeCategoryLabel('Toys')).toBe('toys');
    expect(normalizeCategoryLabel('Digital & Tech')).toBe('digital_tech');
    expect(normalizeCategoryLabel('')).toBe('uncategorized');
  });
});
