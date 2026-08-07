import { itemsApi } from '../api/items.api';
import { Item } from '../interfaces/item.interface';
import {
  parseItemDescription,
  serializeItemDescription,
} from 'shared/utils/parse-item-description.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

export function getRelatedItemIds(
  item: Pick<Item, 'Description' | 'Metadata'>
): string[] {
  if (item.Metadata != null && Array.isArray(item.Metadata.RelatedItemIds)) {
    return item.Metadata.RelatedItemIds;
  }
  const { metadata } = parseItemDescription(item.Description);
  return metadata?.RelatedItemIds ?? [];
}

export function resolveRelatedItems(
  item: Pick<Item, 'Description' | 'Metadata' | 'Id'>,
  wishlistItems: Item[]
): Item[] {
  return getRelatedItemIds(item)
    .map((id) => wishlistItems.find((wishlistItem) => wishlistItem.Id === id))
    .filter((wishlistItem): wishlistItem is Item => !!wishlistItem);
}

function getRelatedNeighbors(itemId: string, wishlistItems: Item[]): string[] {
  const item = wishlistItems.find((i) => i.Id === itemId);
  const forward = item ? getRelatedItemIds(item) : [];
  const reverse = wishlistItems
    .filter((other) => other.Id !== itemId && getRelatedItemIds(other).includes(itemId))
    .map((other) => other.Id);
  return [...new Set([...forward, ...reverse])];
}

/** All items in the same related group as currentItemId (excluding self), for edit UI init. */
export function resolveEditorRelatedItemIds(
  currentItemId: string,
  wishlistItems: Item[]
): string[] {
  const group = new Set<string>();
  const visited = new Set<string>([currentItemId]);
  const queue = [currentItemId];

  while (queue.length > 0) {
    const id = queue.shift()!;
    for (const neighborId of getRelatedNeighbors(id, wishlistItems)) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        group.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return [...group];
}

export function hasRelatedItems(metadata: ItemDescriptionMetadata | null): boolean {
  return (metadata?.RelatedItemIds?.length ?? 0) > 0;
}

function hasMetadataBeyondRelated(metadata: ItemDescriptionMetadata): boolean {
  return Object.entries(metadata).some(([key, value]) => {
    if (key === 'RelatedItemIds' || key === 'Text') return false;
    if (value === null || value === undefined || value === '') return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (key === 'CustomFields') {
      const fields = value as ItemDescriptionMetadata['CustomFields'];
      const hasPredefined = Object.values(fields?.Predefined ?? {}).some(
        (entry) => entry != null && String(entry).trim()
      );
      const hasUserDefined = Object.values(fields?.UserDefined ?? {}).some((entry) => entry.trim());
      return hasPredefined || hasUserDefined;
    }
    if (value === false) return false;
    return true;
  });
}

export function buildDescriptionWithRelatedIds(
  item: Pick<Item, 'Description' | 'Metadata'>,
  relatedIds: string[]
): string | null {
  if (item.Metadata != null) {
    return item.Description ?? null;
  }

  const parsed = parseItemDescription(item.Description);
  const metadata: ItemDescriptionMetadata = { ...(parsed.metadata ?? {}) };

  if (relatedIds.length > 0) {
    metadata.RelatedItemIds = relatedIds;
  } else {
    delete metadata.RelatedItemIds;
  }

  if (!parsed.isJson && relatedIds.length === 0) {
    return item.Description ?? null;
  }

  if (relatedIds.length === 0 && !hasMetadataBeyondRelated(metadata) && !parsed.text) {
    return null;
  }

  if (relatedIds.length === 0 && !hasMetadataBeyondRelated(metadata) && parsed.text) {
    return parsed.text;
  }

  return serializeItemDescription(parsed.text, metadata);
}

export async function syncBidirectionalItemRelated(
  currentItemId: string,
  newRelatedIds: string[]
): Promise<void> {
  await itemsApi.syncItemRelated(currentItemId, newRelatedIds);
}
