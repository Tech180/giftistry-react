import { itemsApi } from '../api/items.api';
import { Item } from '../interfaces/item.interface';
import {
  parseItemDescription,
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

export async function syncBidirectionalItemLinks(
  currentItemId: string,
  newLinkedIds: string[]
): Promise<void> {
  await itemsApi.syncItemLinks(currentItemId, newLinkedIds);
}
