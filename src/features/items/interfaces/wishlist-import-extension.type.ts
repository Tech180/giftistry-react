import type { WISHLIST_IMPORT_EXTENSIONS } from '../constants/wishlist-import.constants';

export type WishlistImportExtension = (typeof WISHLIST_IMPORT_EXTENSIONS)[number];
