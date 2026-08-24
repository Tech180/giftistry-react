import type { Item } from '../interfaces/item.interface';
import { resolveLinkedItems } from './item-links-sync.util';

export function hasUnclaimedLinkedItems(item: Item, wishlistItems: Item[]): boolean {
  const linked = resolveLinkedItems(item, wishlistItems);
  return linked.some((peer) => !peer.IsClaimed);
}
