export const WISHLIST_IMPORT_ACCEPT = '.csv,.xlsx,.txt,.json,.pdf';
export const WISHLIST_IMPORT_MAX_BYTES = 5 * 1024 * 1024;
/** Hard ceiling for a single import (preview rejects above this). */
export const WISHLIST_IMPORT_MAX_ITEMS = 2500;
/** Must match backend MAX_BULK_ADD_BATCH. */
export const WISHLIST_IMPORT_BULK_CHUNK_SIZE = 500;
export const WISHLIST_IMPORT_ALLOWED_EXTENSIONS = [
  'csv',
  'xlsx',
  'txt',
  'json',
  'pdf',
] as const;

export const WISHLIST_IMPORT_SIZE_ERROR =
  'File is too large. Maximum size is 5MB.';
export const WISHLIST_IMPORT_TYPE_ERROR =
  'Unsupported file type. Use CSV, XLSX, TXT, JSON, or PDF.';
