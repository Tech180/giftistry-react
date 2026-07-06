export const COMMENT_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export const COMMENT_ATTACHMENT_ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

export const COMMENT_ATTACHMENT_ACCEPT = COMMENT_ATTACHMENT_ALLOWED_TYPES.join(',');

export const COMMENT_ATTACHMENT_SIZE_ERROR = 'Image size exceeds the 10MB limit.';
export const COMMENT_ATTACHMENT_TYPE_ERROR = 'Only JPEG, PNG, GIF, and WEBP formats are allowed.';
export const COMMENT_GIF_FETCH_ERROR = 'Failed to load GIF. Try another one or upload an image instead.';
