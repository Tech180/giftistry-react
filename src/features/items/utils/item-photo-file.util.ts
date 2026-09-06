import {
  ITEM_PHOTO_ALLOWED_TYPES,
  ITEM_PHOTO_MAX_BYTES,
  ITEM_PHOTO_SIZE_ERROR,
  ITEM_PHOTO_TYPE_ERROR,
} from '../constants/item-photo-attachment';

export function isAllowedItemPhotoType(mimeType: string): boolean {
  return (ITEM_PHOTO_ALLOWED_TYPES as readonly string[]).includes(mimeType);
}

export function validateItemPhotoFile(file: File): string | null {
  if (!isAllowedItemPhotoType(file.type)) {
    return ITEM_PHOTO_TYPE_ERROR;
  }
  if (file.size > ITEM_PHOTO_MAX_BYTES) {
    return ITEM_PHOTO_SIZE_ERROR;
  }
  return null;
}

export function readItemPhotoFileAsDataUrl(file: File): Promise<string> {
  const validationError = validateItemPhotoFile(file);
  if (validationError) {
    return Promise.reject(new Error(validationError));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !result.startsWith('data:image/')) {
        reject(new Error(ITEM_PHOTO_TYPE_ERROR));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error(ITEM_PHOTO_TYPE_ERROR));
    reader.readAsDataURL(file);
  });
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
};

/** Extension for a `data:image/...` URL; defaults to `jpg`. */
export function itemPhotoExtensionFromDataUrl(dataUrl: string): string {
  const match = /^data:(image\/[a-z0-9.+-]+);/i.exec(dataUrl.trim());
  const mime = match?.[1]?.toLowerCase() ?? '';
  return MIME_TO_EXT[mime] ?? 'jpg';
}

/** Triggers a browser download for an item photo data URL. */
export function downloadItemPhotoDataUrl(dataUrl: string, filename: string): void {
  const trimmed = dataUrl.trim();
  if (!trimmed.startsWith('data:image/')) return;

  const link = document.createElement('a');
  link.href = trimmed;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}
