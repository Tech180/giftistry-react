import type { ExtractMetadataResult } from 'features/items/api/items.api';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import {
  parseItemDescription,
  serializeItemDescription,
} from 'shared/utils/parse-item-description.util';
import type { CreatedImportItem } from './map-bulk-created-items.util';

export interface GrabInfoUpdatePayload {
  name: string;
  description: string;
  category: string;
  priority: number | null;
  linkUrl: string | null;
  price: number | null;
  websiteName: string | null;
}

function mergeString(
  extracted: string | null | undefined,
  existing: string | null | undefined,
  fallback = ''
): string {
  const next = extracted?.trim();
  if (next) return next;
  const keep = existing?.trim();
  if (keep) return keep;
  return fallback;
}

export function buildGrabInfoUpdate(
  existing: CreatedImportItem,
  extract: ExtractMetadataResult
): GrabInfoUpdatePayload {
  const parsed = parseItemDescription(existing.description);
  const text = mergeString(extract.Description, parsed.text, '');
  const hasExtractFields =
    Object.keys(extract.CustomFields.Predefined).length > 0 ||
    Object.keys(extract.CustomFields.UserDefined).length > 0;

  let description = text;
  if (hasExtractFields || parsed.metadata) {
    const metadata: ItemDescriptionMetadata = {
      ...(parsed.metadata ?? {}),
      Text: text,
      CustomFields: {
        Predefined: {
          ...(parsed.metadata?.CustomFields?.Predefined ?? {}),
          ...extract.CustomFields.Predefined,
        },
        UserDefined: {
          ...(parsed.metadata?.CustomFields?.UserDefined ?? {}),
          ...extract.CustomFields.UserDefined,
        },
      },
    };
    description = serializeItemDescription(text, metadata);
  } else if (!description && existing.description) {
    description = existing.description;
  }

  return {
    name: mergeString(extract.Title, existing.name, existing.name),
    description,
    category: mergeString(extract.Category, existing.category, existing.category),
    priority: existing.priority,
    linkUrl: existing.linkUrl,
    price: extract.Price != null ? extract.Price : existing.price,
    websiteName: mergeString(extract.WebsiteName, existing.websiteName, '') || null,
  };
}
