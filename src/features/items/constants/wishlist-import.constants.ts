import type { WishlistImportExtension } from '../interfaces/wishlist-import-extension.type';

export const WISHLIST_IMPORT_MAX_BYTES = 5 * 1024 * 1024;

export const WISHLIST_IMPORT_EXTENSIONS = ['csv', 'xlsx', 'txt', 'json', 'md'] as const;

export function getWishlistImportAllowedExtensions(): readonly WishlistImportExtension[] {
  return WISHLIST_IMPORT_EXTENSIONS;
}

export function getWishlistImportAccept(): string {
  return getWishlistImportAllowedExtensions()
    .map((ext) => `.${ext}`)
    .join(',');
}

export function getWishlistImportTypeError(): string {
  return 'Unsupported file type. Use CSV, XLSX, TXT, JSON, or MD.';
}

export const WISHLIST_IMPORT_SIZE_ERROR =
  'File is too large. Maximum size is 5MB.';

export function getWishlistImportFormatOptions(): {
  id: WishlistImportExtension;
  label: string;
}[] {
  return getWishlistImportAllowedExtensions().map((extension) => ({
    id: extension,
    label: extension.toUpperCase(),
  }));
}
