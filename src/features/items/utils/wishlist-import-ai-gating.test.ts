import { describe, expect, test } from 'vitest';
import {
  getWishlistImportAccept,
  getWishlistImportAllowedExtensions,
  getWishlistImportTypeError,
} from 'features/items/constants/wishlist-import.constants';
import { readImportFile } from 'features/items/utils/read-import-file.util';

describe('wishlist import AI format gating', () => {
  test('allows csv, xlsx, txt, json, and md', () => {
    expect(getWishlistImportAccept()).toBe('.csv,.xlsx,.txt,.json,.md');
    expect(getWishlistImportAllowedExtensions()).not.toContain('pdf');
    expect(getWishlistImportTypeError()).not.toMatch(/PDF/i);
  });

  test('readImportFile rejects PDF when AI is off', async () => {
    const file = new File(['%PDF'], 'scan.pdf', { type: 'application/pdf' });
    await expect(readImportFile(file, { allowAi: false })).rejects.toThrow(
      /CSV, XLSX, TXT, JSON, or MD/i
    );
  });

  test('readImportFile rejects PDF when AI is on', async () => {
    const file = new File(['%PDF'], 'scan.pdf', { type: 'application/pdf' });
    await expect(readImportFile(file, { allowAi: true })).rejects.toThrow(
      /CSV, XLSX, TXT, JSON, or MD/i
    );
  });
});
