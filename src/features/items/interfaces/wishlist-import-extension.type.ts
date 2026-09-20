import type {
  WISHLIST_IMPORT_AI_EXTENSIONS,
  WISHLIST_IMPORT_BASE_EXTENSIONS,
} from '../constants/wishlist-import.constants';

export type WishlistImportBaseExtension = (typeof WISHLIST_IMPORT_BASE_EXTENSIONS)[number];
export type WishlistImportAiExtension = (typeof WISHLIST_IMPORT_AI_EXTENSIONS)[number];
export type WishlistImportExtension = WishlistImportBaseExtension | WishlistImportAiExtension;
