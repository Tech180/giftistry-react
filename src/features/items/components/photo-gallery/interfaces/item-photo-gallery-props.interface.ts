export interface ItemPhotoGalleryEntry {
  /** Local client key (stable for React keys while editing). */
  localId: string;
  /** Server photo id when loaded from an existing item. */
  id?: string;
  dataUrl: string;
}

export interface ItemPhotoGalleryProps {
  photos: ItemPhotoGalleryEntry[];
  onChange: (photos: ItemPhotoGalleryEntry[]) => void;
  disabled?: boolean;
  errorMsg?: string | null;
  onError?: (message: string | null) => void;
}
