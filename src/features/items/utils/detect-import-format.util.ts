import type { ImportFileFormat } from '../interfaces/import-file-format.interface';
import { getWishlistImportAllowedExtensions } from '../constants/wishlist-import.constants';

export function detectImportFormat(fileName: string): ImportFileFormat {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if ((getWishlistImportAllowedExtensions(true) as readonly string[]).includes(ext)) {
    return ext as ImportFileFormat;
  }
  return 'unknown';
}

export function filenameStemAsTitle(fileName: string): string {
  const base = fileName.split('/').pop() || fileName;
  return base.replace(/\.[^.]+$/, '').trim() || 'Imported Wishlist';
}
