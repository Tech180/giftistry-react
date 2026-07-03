import { describe, expect, test } from 'vitest';
import { getSiteName } from './get-site-name.util';

describe('getSiteName', () => {
  test('extracts hostname without www prefix', () => {
    expect(getSiteName('https://www.amazon.com/dp/123')).toBe('Amazon.com');
  });

  test('capitalizes hostname', () => {
    expect(getSiteName('https://etsy.com/listing/1')).toBe('Etsy.com');
  });

  test('returns Store for invalid URLs', () => {
    expect(getSiteName('not-a-url')).toBe('View Store');
  });
});
