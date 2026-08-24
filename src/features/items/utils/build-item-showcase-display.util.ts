import type { ShowcaseVariationOption } from '../interfaces/showcase-variation-option.interface';
import type { ShowcaseVariationProgress } from '../interfaces/showcase-variation-progress.interface';
import type { ShowcaseRelationItem } from '../interfaces/showcase-relation-item.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import { hasPriorityValue } from './item-priority.util';

export function formatShowcaseStatusLabel(
  isFullyClaimed: boolean,
  claimedByCurrentUser: boolean
): string {
  if (isFullyClaimed) return 'Claimed';
  if (claimedByCurrentUser) return 'Claimed by you';
  return 'Available';
}

export function formatShowcaseBestPrice(totalExtractedPrice: number): string {
  return totalExtractedPrice > 0 ? `$${totalExtractedPrice.toFixed(2)}` : '—';
}

export function formatShowcaseDisplayCategory(
  categoryLabel: string | undefined,
  item: Pick<Item, 'CategoryLabel' | 'Category'>
): string {
  return categoryLabel || item.CategoryLabel || item.Category || 'Uncategorized';
}

export function resolveShowcaseHasNumericPriority(
  priority: Item['Priority']
): boolean {
  return hasPriorityValue(priority);
}

export function buildShowcaseVariationProgress(
  item: Pick<Item, 'Claims'>,
  metadata: ItemDescriptionMetadata | null | undefined
): ShowcaseVariationProgress[] {
  const variations = metadata?.Variations;
  if (!variations?.length) return [];

  return variations.map((variation) => {
    const claimed = item.Claims.filter((c) => c.Selection === variation.Name).reduce(
      (sum, c) => sum + (c.Quantity || 1),
      0
    );
    const total = variation.Quantity;
    const percent = total > 0 ? Math.min(100, Math.round((claimed / total) * 100)) : 0;
    return {
      name: variation.Name,
      claimed,
      total,
      percent,
      qtyLabel: `${claimed} / ${total} claimed`,
    };
  });
}

export function buildShowcaseRelationItems(items: Item[]): ShowcaseRelationItem[] {
  return items.map((related) => ({
    id: related.Id,
    name: related.Name,
    statusLabel:
      related.IsFullyClaimed || related.IsClaimed ? 'Claimed' : 'Available',
  }));
}

export function formatShowcaseSuggestionLabel(
  suggestedByDisplayName: string | null | undefined
): string {
  return `Suggestion by ${suggestedByDisplayName || 'Collaborator'}`;
}

export function formatShowcaseQuantityProgressMetric(
  progressPercent: number,
  claimedQty: number,
  desiredQty: number
): string {
  return `${progressPercent}% (${claimedQty} / ${desiredQty})`;
}

export function resolveShowcaseVariationOptions(
  item: Pick<Item, 'Claims'>,
  metadata: ItemDescriptionMetadata | null | undefined
): ShowcaseVariationOption[] {
  const variations = metadata?.Variations;
  if (!variations?.length) return [];

  return variations.map((variation) => {
    const claimed = item.Claims.filter((c) => c.Selection === variation.Name).reduce(
      (sum, c) => sum + (c.Quantity || 1),
      0
    );
    const remaining = Math.max(0, variation.Quantity - claimed);
    return {
      name: variation.Name,
      remaining,
      disabled: remaining <= 0,
      optionLabel: `${variation.Name} (${remaining} remaining)`,
    };
  });
}
