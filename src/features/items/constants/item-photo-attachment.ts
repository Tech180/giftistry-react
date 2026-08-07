export const ITEM_PHOTO_MAX_COUNT = 10;
export const ITEM_PHOTO_MAX_BYTES = 20 * 1024 * 1024;

export const ITEM_PHOTO_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const ITEM_PHOTO_ACCEPT = ITEM_PHOTO_ALLOWED_TYPES.join(',');

export const ITEM_PHOTO_SIZE_ERROR = 'Image size exceeds the 20MB limit.';
export const ITEM_PHOTO_TYPE_ERROR = 'Only JPEG, PNG, GIF, and WEBP formats are allowed.';
export const ITEM_PHOTO_MAX_COUNT_ERROR = 'An item may have at most 10 photos.';
