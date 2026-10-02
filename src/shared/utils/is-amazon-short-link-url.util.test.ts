import { describe, expect, it } from 'vitest';
import { isAmazonShortLinkUrl } from './is-amazon-short-link-url.util';

describe('isAmazonShortLinkUrl', () => {
  it('detects Amazon short-link hosts', () => {
    expect(isAmazonShortLinkUrl('https://a.co/d/09RD8uDq')).toBe(true);
    expect(isAmazonShortLinkUrl('https://amzn.to/abc123')).toBe(true);
    expect(isAmazonShortLinkUrl('https://amzn.com/x')).toBe(true);
    expect(isAmazonShortLinkUrl('https://www.amzn.to/x')).toBe(true);
  });

  it('rejects full Amazon product URLs and unrelated hosts', () => {
    expect(isAmazonShortLinkUrl('https://www.amazon.com/dp/B0GX9QTR2P')).toBe(false);
    expect(isAmazonShortLinkUrl('https://shop.example/hoodie')).toBe(false);
  });

  it('rejects empty or invalid values', () => {
    expect(isAmazonShortLinkUrl('')).toBe(false);
    expect(isAmazonShortLinkUrl('   ')).toBe(false);
    expect(isAmazonShortLinkUrl('not-a-url')).toBe(false);
  });
});
