import type { Item } from '../interfaces/item.interface';
import { resolveEditorLinkedItemIds } from './item-links-sync.util';

/**
 * Peers in the same bidirectional link group that the current user has claimed
 * (excluding the source item). Used to gate IncludeLinked on unclaim.
 */
export function resolveLinkedUnclaimPeers(
  item: Item,
  wishlistItems: Item[],
  userId: string | null | undefined
): Item[] {
  if (!userId) {
    return [];
  }
  const groupIds = resolveEditorLinkedItemIds(item.Id, wishlistItems);
  return groupIds
    .map((id) => wishlistItems.find((wishlistItem) => wishlistItem.Id === id))
    .filter((peer): peer is Item => {
      if (!peer || peer.Id === item.Id) {
        return false;
      }
      return (peer.Claims ?? []).some((claim) => claim.UserId === userId);
    });
}

export function hasLinkedUnclaimPeers(
  item: Item,
  wishlistItems: Item[],
  userId: string | null | undefined
): boolean {
  return resolveLinkedUnclaimPeers(item, wishlistItems, userId).length > 0;
}
