import type { ImportFileFormat } from '../interfaces/import-file-format.interface';
import { WISHLIST_IMPORT_ALLOWED_EXTENSIONS } from '../constants/wishlist-import.constants';

export function detectImportFormat(fileName: string): ImportFileFormat {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if ((WISHLIST_IMPORT_ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return ext as ImportFileFormat;
  }
  return 'unknown';
}

export function filenameStemAsTitle(fileName: string): string {
  const base = fileName.split('/').pop() || fileName;
  return base.replace(/\.[^.]+$/, '').trim() || 'Imported Wishlist';
}
