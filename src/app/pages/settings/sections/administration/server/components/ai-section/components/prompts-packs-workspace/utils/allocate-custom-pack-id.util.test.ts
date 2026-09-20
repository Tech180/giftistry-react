import { describe, expect, test } from 'vitest';
import { allocateCustomPackId } from './allocate-custom-pack-id.util';
import { slugifyPackLabel } from './slugify-pack-label.util';

describe('slugifyPackLabel', () => {
  test('lowercases and hyphenates', () => {
    expect(slugifyPackLabel('Sci-Fi Books')).toBe('sci-fi-books');
    expect(slugifyPackLabel('  ')).toBe('pack');
  });
});

describe('allocateCustomPackId', () => {
  test('prefixes custom. and suffixes on collision', () => {
    expect(allocateCustomPackId('Books', new Set())).toBe('custom.books');
    expect(allocateCustomPackId('Books', new Set(['custom.books']))).toBe('custom.books-2');
    expect(allocateCustomPackId('Books', new Set(['custom.books', 'custom.books-2']))).toBe(
      'custom.books-3'
    );
  });
});
