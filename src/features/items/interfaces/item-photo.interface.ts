export interface ItemPhoto {
  Id: string;
  Url: string;
  SortOrder: number;
}

/** Write payload entry for create/update Metadata.Photos */
export interface ItemPhotoWrite {
  DataUrl: string;
}
