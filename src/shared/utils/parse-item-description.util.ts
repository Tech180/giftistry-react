import type {
  ItemDescriptionMetadata,
  ParsedItemDescription,
} from 'shared/interfaces/item-description-metadata.interface';

export type { ItemDescriptionMetadata, ParsedItemDescription };

function isJsonDescription(description: string): boolean {
  return description.startsWith('{') && description.endsWith('}');
}

export function parseItemDescription(
  description: string | null | undefined
): ParsedItemDescription {
  if (!description) {
    return { text: null, metadata: null, isJson: false };
  }

  if (!isJsonDescription(description)) {
    return { text: description, metadata: null, isJson: false };
  }

  try {
    const parsed = JSON.parse(description) as ItemDescriptionMetadata;
    if (parsed && typeof parsed === 'object') {
      const text =
        typeof parsed.text === 'string' && parsed.text.length > 0 ? parsed.text : null;
      return { text: text ?? description, metadata: parsed, isJson: true };
    }
  } catch {
    /* fall through */
  }

  return { text: description, metadata: null, isJson: false };
}

export function getItemFavoriteFlag(description: string | null | undefined): boolean {
  const { metadata } = parseItemDescription(description);
  return !!metadata?.isFavorite;
}

export function getItemFavoriteOrPinnedFlag(description: string | null | undefined): boolean {
  const { metadata } = parseItemDescription(description);
  return !!(metadata?.isFavorite || metadata?.isPinned);
}

export function serializeItemDescription(
  text: string | null | undefined,
  metadata: ItemDescriptionMetadata | null
): string {
  if (!metadata) {
    return text || '';
  }
  return JSON.stringify({ ...metadata, text: text || metadata.text || '' });
}

export function formatDescriptionForExport(description: string | null | undefined): string {
  const { text, metadata, isJson } = parseItemDescription(description);
  if (!isJson || !metadata) {
    return text || description || '';
  }

  const parts: string[] = [];
  if (text) parts.push(text);

  const metaParts: string[] = [];
  if (metadata.pantsSize) metaParts.push(`Pants: ${metadata.pantsSize}`);
  if (metadata.shirtSize) metaParts.push(`Shirt: ${metadata.shirtSize}`);
  if (metadata.shoesSize) metaParts.push(`Shoes: ${metadata.shoesSize}`);
  if (metadata.socksSize) metaParts.push(`Socks: ${metadata.socksSize}`);
  if (metadata.color) metaParts.push(`Color: ${metadata.color}`);
  if (Array.isArray(metadata.custom)) {
    for (const field of metadata.custom) {
      if (field.name && field.value) {
        metaParts.push(`${field.name}: ${field.value}`);
      }
    }
  }
  if (metaParts.length > 0) {
    parts.push(`[${metaParts.join(', ')}]`);
  }

  return parts.join(' ');
}
