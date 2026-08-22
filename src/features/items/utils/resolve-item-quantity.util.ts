import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemQuantitySummary } from '../interfaces/item-quantity-summary.interface';

/**
 * Resolve multi-count / desired quantity for list cards and claim state.
 * Prefers server claim summaries, then metadata, then claim rows.
 */
export function resolveItemQuantitySummary(
  item: Item,
  metadata?: ItemDescriptionMetadata | null
): ItemQuantitySummary {
  const meta = metadata ?? item.Metadata ?? null;

  const desiredQuantity = Math.max(
    1,
    Number(
      item.DesiredQuantity != null
        ? item.DesiredQuantity
        : meta?.DesiredQuantity != null
          ? meta.DesiredQuantity
          : 1
    ) || 1
  );

  const claimedQuantity =
    item.TotalClaimedQuantity != null
      ? item.TotalClaimedQuantity
      : item.Claims.reduce((sum, claim) => sum + (claim.Quantity || 1), 0);

  const isMultiCount =
    item.IsMultiCount != null
      ? item.IsMultiCount
      : meta?.MultiCount === true || desiredQuantity > 1;

  const progressPercent =
    desiredQuantity > 0
      ? Math.min(100, Math.round((claimedQuantity / desiredQuantity) * 100))
      : 0;

  return {
    isMultiCount,
    desiredQuantity,
    claimedQuantity,
    shouldDisplay: desiredQuantity > 1,
    progressPercent,
  };
}

/** Label for list badges: owners see desired ×N; guests see remaining ×N. */
export function formatItemQuantityBadge(
  summary: ItemQuantitySummary,
  isOwner = false,
): string {
  if (isOwner) {
    return `×${summary.desiredQuantity}`;
  }
  const remaining = Math.max(0, summary.desiredQuantity - summary.claimedQuantity);
  return `×${remaining}`;
}
