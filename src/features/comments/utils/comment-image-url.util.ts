import {
  COMMENT_ATTACHMENT_ALLOWED_TYPES,
  COMMENT_ATTACHMENT_MAX_BYTES,
  COMMENT_ATTACHMENT_SIZE_ERROR,
  COMMENT_ATTACHMENT_TYPE_ERROR,
  COMMENT_GIF_FETCH_ERROR,
} from '../constants/comment-attachment';

const DATA_URL_PATTERN = /^data:image\/(jpeg|png|gif|webp);base64,/i;

export function isCommentImageDataUrl(value: string): boolean {
  return DATA_URL_PATTERN.test(value);
}

function isAllowedImageType(mimeType: string): boolean {
  return (COMMENT_ATTACHMENT_ALLOWED_TYPES as readonly string[]).includes(mimeType);
}

export async function remoteImageUrlToDataUrl(url: string): Promise<string> {
  if (isCommentImageDataUrl(url)) {
    return url;
  }

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error(COMMENT_GIF_FETCH_ERROR);
  }

  if (!response.ok) {
    throw new Error(COMMENT_GIF_FETCH_ERROR);
  }

  const blob = await response.blob();
  const mimeType = blob.type || 'image/gif';

  if (!isAllowedImageType(mimeType)) {
    throw new Error(COMMENT_ATTACHMENT_TYPE_ERROR);
  }

  if (blob.size > COMMENT_ATTACHMENT_MAX_BYTES) {
    throw new Error(COMMENT_ATTACHMENT_SIZE_ERROR);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string' || !isCommentImageDataUrl(result)) {
        reject(new Error(COMMENT_GIF_FETCH_ERROR));
        return;
      }
      resolve(result);
    };
    reader.onerror = () => reject(new Error(COMMENT_GIF_FETCH_ERROR));
    reader.readAsDataURL(blob);
  });
}
