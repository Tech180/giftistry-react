import { describe, expect, test } from 'vitest';
import { toOpenableLinkUrl } from './to-openable-link-url.util';

describe('toOpenableLinkUrl', () => {
  test('returns null for blank input', () => {
    expect(toOpenableLinkUrl('')).toBeNull();
    expect(toOpenableLinkUrl('   ')).toBeNull();
  });

  test('passes through http(s) URLs', () => {
    expect(toOpenableLinkUrl('https://example.com/item')).toBe('https://example.com/item');
    expect(toOpenableLinkUrl('http://example.com')).toBe('http://example.com/');
  });

  test('prefixes https when scheme is missing', () => {
    expect(toOpenableLinkUrl('example.com/item')).toBe('https://example.com/item');
  });

  test('rejects non-http schemes', () => {
    expect(toOpenableLinkUrl('javascript:alert(1)')).toBeNull();
    expect(toOpenableLinkUrl('ftp://files.example')).toBeNull();
  });
});
