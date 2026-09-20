import { describe, expect, test } from 'vitest';
import { isCommentImageDataUrl } from './comment-image-url.util';

describe('isCommentImageDataUrl', () => {
  test('accepts jpeg/png/gif/webp data URLs', () => {
    expect(isCommentImageDataUrl('data:image/png;base64,abc')).toBe(true);
    expect(isCommentImageDataUrl('data:image/jpeg;base64,abc')).toBe(true);
    expect(isCommentImageDataUrl('data:image/gif;base64,abc')).toBe(true);
    expect(isCommentImageDataUrl('data:image/webp;base64,abc')).toBe(true);
  });

  test('rejects non-image or non-data URLs', () => {
    expect(isCommentImageDataUrl('https://example.com/a.png')).toBe(false);
    expect(isCommentImageDataUrl('data:image/svg+xml;base64,abc')).toBe(false);
    expect(isCommentImageDataUrl('')).toBe(false);
  });
});
