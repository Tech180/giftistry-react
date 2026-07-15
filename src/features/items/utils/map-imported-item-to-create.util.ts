import { serializeItemDescription } from 'shared/utils/parse-item-description.util';
import type { ImportedItemPreview } from '../interfaces/imported-item-preview.interface';

export interface CreateItemFromImportPayload {
  name: string;
  description: string | null;
  linkUrl: string | null;
  price: number | null;
  category: string | null;
  priority: number | null;
}

export function mapImportedItemToCreate(
  item: ImportedItemPreview
): CreateItemFromImportPayload {
  const text = item.Description?.trim() || '';
  const needsMetadata = item.IsFavorite === true || !!item.Color || !!item.Size;

  const description = needsMetadata
    ? serializeItemDescription(text || null, {
        Text: text || undefined,
        IsFavorite: item.IsFavorite === true,
        CustomFields: {
          Predefined: {
            ...(item.Color ? { Color: item.Color } : {}),
          },
          UserDefined: {
            ...(item.Size ? { Size: item.Size } : {}),
          },
        },
      })
    : text || null;

  return {
    name: item.Name.trim(),
    description,
    linkUrl: item.WebsiteLink?.trim() || null,
    price: item.Price ?? null,
    category: item.Category?.trim() || null,
    priority: item.Priority ?? null,
  };
}
