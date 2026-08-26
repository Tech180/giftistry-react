export const WISHLIST_IMPORT_MAX_BYTES = 5 * 1024 * 1024;

export const WISHLIST_IMPORT_BASE_EXTENSIONS = ['csv', 'xlsx', 'txt', 'json', 'md'] as const;
export const WISHLIST_IMPORT_AI_EXTENSIONS = ['pdf'] as const;

export type WishlistImportBaseExtension =
  (typeof WISHLIST_IMPORT_BASE_EXTENSIONS)[number];
export type WishlistImportAiExtension =
  (typeof WISHLIST_IMPORT_AI_EXTENSIONS)[number];
export type WishlistImportExtension =
  | WishlistImportBaseExtension
  | WishlistImportAiExtension;

export function getWishlistImportAllowedExtensions(
  allowAi: boolean
): readonly WishlistImportExtension[] {
  return allowAi
    ? [...WISHLIST_IMPORT_BASE_EXTENSIONS, ...WISHLIST_IMPORT_AI_EXTENSIONS]
    : WISHLIST_IMPORT_BASE_EXTENSIONS;
}

export function getWishlistImportAccept(allowAi: boolean): string {
  return getWishlistImportAllowedExtensions(allowAi)
    .map((ext) => `.${ext}`)
    .join(',');
}

export function getWishlistImportTypeError(allowAi: boolean): string {
  return allowAi
    ? 'Unsupported file type. Use CSV, XLSX, TXT, JSON, MD, or PDF.'
    : 'Unsupported file type. Use CSV, XLSX, TXT, JSON, or MD.';
}

export const WISHLIST_IMPORT_SIZE_ERROR =
  'File is too large. Maximum size is 5MB.';

export function getWishlistImportFormatOptions(allowAi: boolean): {
  id: WishlistImportExtension;
  label: string;
}[] {
  return getWishlistImportAllowedExtensions(allowAi).map((extension) => ({
    id: extension,
    label: extension.toUpperCase(),
  }));
}
