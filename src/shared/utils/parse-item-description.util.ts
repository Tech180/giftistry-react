import type {
  ItemDescriptionMetadata,
  ParsedItemDescription,
} from 'shared/interfaces/item-description-metadata.interface';
import {
  buildItemDescriptionPayload,
  getMetadataDisplayEntries,
  getMetadataText,
  normalizeItemDescriptionMetadata,
} from './item-custom-fields.util';

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
      const normalized = normalizeItemDescriptionMetadata(parsed);
      const text = getMetadataText(normalized);
      return {
        text: text.length > 0 ? text : null,
        metadata: normalized,
        isJson: true,
      };
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
  const normalized = normalizeItemDescriptionMetadata({
    ...metadata,
    Text: text || getMetadataText(metadata),
  });
  return buildItemDescriptionPayload({
    text: text || getMetadataText(normalized),
    predefined: normalized.CustomFields?.Predefined ?? {},
    userDefined: normalized.CustomFields?.UserDefined ?? {},
    desiredQuantity: normalized.desiredQuantity,
    variations: normalized.variations,
    linkedItemIds: normalized.linkedItemIds,
    otherUsersCanSee: normalized.otherUsersCanSee,
    multiCount: normalized.multiCount,
    isFavorite: normalized.isFavorite,
    isPinned: normalized.isPinned,
    alwaysJson: true,
  });
}

export function formatDescriptionForExport(description: string | null | undefined): string {
  const { text, metadata, isJson } = parseItemDescription(description);
  if (!isJson || !metadata) {
    return text || description || '';
  }

  const parts: string[] = [];
  if (text) parts.push(text);

  const metaParts = getMetadataDisplayEntries(metadata).map(
    (entry) => `${entry.label}: ${entry.value}`
  );

  if (metaParts.length > 0) {
    parts.push(`[${metaParts.join(', ')}]`);
  }

  return parts.join(' ');
}
