import { describe, expect, test } from 'vitest';
import {
  getWishlistImportAccept,
  getWishlistImportAllowedExtensions,
  getWishlistImportTypeError,
} from 'features/items/constants/wishlist-import.constants';
import { readImportFile } from 'features/items/utils/read-import-file.util';

describe('wishlist import AI format gating', () => {
  test('excludes PDF from accept list when AI is off', () => {
    expect(getWishlistImportAccept(false)).toBe('.csv,.xlsx,.txt,.json');
    expect(getWishlistImportAllowedExtensions(false)).not.toContain('pdf');
    expect(getWishlistImportTypeError(false)).not.toMatch(/PDF/i);
  });

  test('includes PDF when AI is on', () => {
    expect(getWishlistImportAccept(true)).toContain('.pdf');
    expect(getWishlistImportAllowedExtensions(true)).toContain('pdf');
    expect(getWishlistImportTypeError(true)).toMatch(/PDF/i);
  });

  test('readImportFile rejects PDF when allowAi is false', async () => {
    const file = new File(['%PDF'], 'scan.pdf', { type: 'application/pdf' });
    await expect(readImportFile(file, { allowAi: false })).rejects.toThrow(
      /CSV, XLSX, TXT, or JSON/i
    );
  });
});
