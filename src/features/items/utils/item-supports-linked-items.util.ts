import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { Item } from '../interfaces/item.interface';

/**
 * Linked items are unsupported for suggestions, unlimited quantity (0),
 * and when quantity is greater than 1.
 * Uses the max of top-level and metadata DesiredQuantity so edit drafts
 * (qty in Metadata only) still block linking. Ignores a false IsMultiCount
 * when quantity is already > 1.
 */
export function itemSupportsLinkedItems(
  item: Item,
  metadata?: ItemDescriptionMetadata | null
): boolean {
  if (item.IsSuggestion === true) {
    return false;
  }

  const meta = metadata ?? item.Metadata ?? null;
  const readQty = (raw: number | null | undefined): number | null => {
    if (raw == null) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return parsed;
  };
  const topQty = readQty(item.DesiredQuantity);
  const metaQty = readQty(meta?.DesiredQuantity ?? null);
  if (topQty === 0 || metaQty === 0) {
    return false;
  }
  const desiredQuantity = Math.max(topQty ?? 1, metaQty ?? 1, 1);

  if (desiredQuantity > 1) {
    return false;
  }
  if (item.IsMultiCount === true || meta?.MultiCount === true) {
    return false;
  }
  return true;
}

export function linkGroupSupportsLinkedItems(
  source: Item,
  peers: Item[],
  sourceMetadata?: ItemDescriptionMetadata | null
): boolean {
  if (!itemSupportsLinkedItems(source, sourceMetadata)) {
    return false;
  }
  return peers.every((peer) => itemSupportsLinkedItems(peer));
}
