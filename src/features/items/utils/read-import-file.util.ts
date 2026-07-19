import {
  WISHLIST_IMPORT_MAX_BYTES,
  WISHLIST_IMPORT_SIZE_ERROR,
  getWishlistImportAllowedExtensions,
  getWishlistImportTypeError,
} from '../constants/wishlist-import.constants';
import type { ImportFileFormat } from '../interfaces/import-file-format.interface';
import { detectImportFormat } from './detect-import-format.util';

export type ImportContentEncoding = 'text' | 'base64' | 'data-url';

export interface ReadImportFileResult {
  fileName: string;
  format: ImportFileFormat;
  content: string;
  contentEncoding: ImportContentEncoding;
}

export interface ReadImportFileOptions {
  onProgress?: (percent: number) => void;
  allowAi?: boolean;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function readWithProgress(
  file: File,
  mode: 'text' | 'data-url',
  onProgress?: (percent: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (!event.lengthComputable || event.total <= 0) return;
      onProgress?.(clampPercent((event.loaded / event.total) * 100));
    };
    reader.onload = () => {
      onProgress?.(100);
      resolve(String(reader.result ?? ''));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    if (mode === 'data-url') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  });
}

export async function readImportFile(
  file: File,
  options: ReadImportFileOptions = {}
): Promise<ReadImportFileResult> {
  if (file.size > WISHLIST_IMPORT_MAX_BYTES) {
    throw new Error(WISHLIST_IMPORT_SIZE_ERROR);
  }

  const allowAi = options.allowAi ?? false;
  const format = detectImportFormat(file.name);
  const allowed = getWishlistImportAllowedExtensions(allowAi) as readonly string[];
  if (format === 'unknown' || !allowed.includes(format)) {
    throw new Error(getWishlistImportTypeError(allowAi));
  }

  options.onProgress?.(0);

  if (format === 'xlsx' || format === 'pdf') {
    const dataUrl = await readWithProgress(file, 'data-url', options.onProgress);
    return {
      fileName: file.name,
      format,
      content: dataUrl,
      contentEncoding: 'data-url',
    };
  }

  const text = await readWithProgress(file, 'text', options.onProgress);
  return {
    fileName: file.name,
    format,
    content: text,
    contentEncoding: 'text',
  };
}
