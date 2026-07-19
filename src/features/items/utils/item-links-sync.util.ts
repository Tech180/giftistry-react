import { itemsApi } from '../api/items.api';
import { getItemSharedWithUserIds } from './item-audience.util';
import { Item } from '../interfaces/item.interface';
import {
  parseItemDescription,
  serializeItemDescription,
} from 'shared/utils/parse-item-description.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

export function getLinkedItemIds(
  item: Pick<Item, 'Description' | 'Metadata'>
): string[] {
  if (item.Metadata != null && Array.isArray(item.Metadata.LinkedItemIds)) {
    return item.Metadata.LinkedItemIds;
  }
  const { metadata } = parseItemDescription(item.Description);
  return metadata?.LinkedItemIds ?? [];
}

export function resolveLinkedItems(
  item: Pick<Item, 'Description' | 'Metadata' | 'Id'>,
  wishlistItems: Item[]
): Item[] {
  return getLinkedItemIds(item)
    .map((id) => wishlistItems.find((wishlistItem) => wishlistItem.Id === id))
    .filter((wishlistItem): wishlistItem is Item => !!wishlistItem);
}

function getLinkNeighbors(itemId: string, wishlistItems: Item[]): string[] {
  const item = wishlistItems.find((i) => i.Id === itemId);
  const forward = item ? getLinkedItemIds(item) : [];
  const reverse = wishlistItems
    .filter((other) => other.Id !== itemId && getLinkedItemIds(other).includes(itemId))
    .map((other) => other.Id);
  return [...new Set([...forward, ...reverse])];
}

/** All items in the same link group as currentItemId (excluding self), for edit UI init. */
export function resolveEditorLinkedItemIds(
  currentItemId: string,
  wishlistItems: Item[]
): string[] {
  const group = new Set<string>();
  const visited = new Set<string>([currentItemId]);
  const queue = [currentItemId];

  while (queue.length > 0) {
    const id = queue.shift()!;
    for (const neighborId of getLinkNeighbors(id, wishlistItems)) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        group.add(neighborId);
        queue.push(neighborId);
      }
    }
  }

  return [...group];
}

export function hasLinkedItems(metadata: ItemDescriptionMetadata | null): boolean {
  return (metadata?.LinkedItemIds?.length ?? 0) > 0;
}

function hasMetadataBeyondLinks(metadata: ItemDescriptionMetadata): boolean {
  return Object.entries(metadata).some(([key, value]) => {
    if (key === 'LinkedItemIds' || key === 'Text') return false;
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

export function buildDescriptionWithLinkedIds(
  item: Pick<Item, 'Description' | 'Metadata'>,
  linkedIds: string[]
): string | null {
  // Prefer Metadata when present; only rewrite Description for legacy rows
  // that still store link ids in the JSON Description blob.
  if (item.Metadata != null) {
    return item.Description ?? null;
  }

  const parsed = parseItemDescription(item.Description);
  const metadata: ItemDescriptionMetadata = { ...(parsed.metadata ?? {}) };

  if (linkedIds.length > 0) {
    metadata.LinkedItemIds = linkedIds;
  } else {
    delete metadata.LinkedItemIds;
  }

  if (!parsed.isJson && linkedIds.length === 0) {
    return item.Description ?? null;
  }

  if (linkedIds.length === 0 && !hasMetadataBeyondLinks(metadata) && !parsed.text) {
    return null;
  }

  if (linkedIds.length === 0 && !hasMetadataBeyondLinks(metadata) && parsed.text) {
    return parsed.text;
  }

  return serializeItemDescription(parsed.text, metadata);
}

export interface LinkSyncUpdate {
  itemId: string;
  linkedItemIds: string[];
  description: string | null;
}

export function computeLinkSyncUpdates(
  currentItemId: string,
  newLinkedIds: string[],
  wishlistItems: Item[],
  previousLinkedIds?: string[]
): LinkSyncUpdate[] {
  const newGroup = new Set([currentItemId, ...newLinkedIds]);

  const oldGroupIds =
    previousLinkedIds ??
    getLinkedItemIds(
      wishlistItems.find((i) => i.Id === currentItemId) ?? { Description: null }
    );
  const oldGroup = new Set([currentItemId, ...oldGroupIds]);

  const itemsToUpdate = new Set<string>([...oldGroup, ...newGroup]);
  const updates: LinkSyncUpdate[] = [];

  for (const itemId of itemsToUpdate) {
    const item = wishlistItems.find((i) => i.Id === itemId);
    if (!item) continue;

    let targetLinks: string[];
    if (newGroup.has(itemId)) {
      targetLinks = [...newGroup].filter((id) => id !== itemId);
    } else {
      const existing = getLinkedItemIds(item);
      targetLinks = existing.filter((id) => !oldGroup.has(id));
    }

    const existing = getLinkedItemIds(item);
    const unchanged =
      existing.length === targetLinks.length &&
      existing.every((id) => targetLinks.includes(id));

    if (unchanged) continue;

    updates.push({
      itemId,
      linkedItemIds: targetLinks,
      description: buildDescriptionWithLinkedIds(item, targetLinks),
    });
  }

  return updates;
}

export async function syncBidirectionalItemLinks(
  currentItemId: string,
  newLinkedIds: string[],
  wishlistItems: Item[],
  previousLinkedIds?: string[]
): Promise<void> {
  await itemsApi.syncItemLinks(currentItemId, newLinkedIds);
}
