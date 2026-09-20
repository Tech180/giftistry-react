import type { WishlistImportExtension } from 'features/items/interfaces/wishlist-import-extension.type';

export interface Handle {
  /** Opens the file picker, optionally filtered to one extension. Must run in a user gesture. */
  browse: (extension?: WishlistImportExtension) => void;
  /** Starts the import flow with an already-chosen file (e.g. from the mobile FAB dropzone). */
  acceptFile: (file: File) => void;
}
