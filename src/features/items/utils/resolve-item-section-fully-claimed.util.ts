import { normalizeItemDescriptionMetadata } from 'shared/utils/item-custom-fields.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionSummary } from '../interfaces/item-substitution.interface';
import {
  isItemGroupFundingFullyFunded,
  resolveActiveItemFullyClaimed,
  resolveItemFundingSnapshot,
} from './is-item-group-funding-active.util';
import { resolveItemQuantitySummary } from './resolve-item-quantity.util';
import type { SubstitutionBrowseOption } from './resolve-item-substitution-options.util';

export interface ItemSectionFullyClaimedInput {
  isFullyClaimed?: boolean | null;
  isClaimed?: boolean;
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  isMultiCount: boolean;
  claimedQuantity: number;
  desiredQuantity: number;
}

/** GF-aware fully-claimed for a parent or substitution section. */
export function resolveItemSectionFullyClaimed(
  input: ItemSectionFullyClaimedInput
): boolean {
  return resolveActiveItemFullyClaimed(input);
}

function metadataFromSubstitutionSummary(
  child: ItemSubstitutionSummary
): ItemDescriptionMetadata {
  return normalizeItemDescriptionMetadata({
    Text: child.Description,
    CustomFields: {
      Predefined: child.CustomFields?.Predefined ?? {},
      UserDefined: child.CustomFields?.UserDefined ?? {},
    },
    MultiCount: child.MultiCount || undefined,
    DesiredQuantity: child.DesiredQuantity ?? undefined,
    Variations: child.Variations ?? undefined,
    IsFavorite: child.IsFavorite || undefined,
    IsPinned: child.IsPinned || undefined,
  });
}

function substitutionSummaryAsItem(child: ItemSubstitutionSummary): Item {
  const metadata = metadataFromSubstitutionSummary(child);
  return {
    Id: child.Id,
    ListId: '',
    PriorityId: child.PriorityId ?? null,
    SuggestedByUserId: null,
    Name: child.Name,
    Description: child.Description,
    IsHiddenIdea: false,
    Category: child.Category ?? 'uncategorized',
    Links: child.Links ?? [],
    Claims: child.Claims ?? [],
    IsClaimed: child.IsClaimed,
    Metadata: metadata,
    IsFullyClaimed: child.IsFullyClaimed,
    IsMultiCount: child.MultiCount === true,
    DesiredQuantity: child.DesiredQuantity ?? null,
    TotalClaimedQuantity: child.TotalClaimedQuantity,
    FundingTarget: child.FundingTarget,
    TotalClaimedAmount: child.TotalClaimedAmount,
  };
}

function sectionQuantityContext(
  item: Item,
  metadata?: ItemDescriptionMetadata | null
) {
  const quantity = resolveItemQuantitySummary(item, metadata);
  return {
    isMultiCount: quantity.isMultiCount,
    claimedQuantity: quantity.claimedQuantity,
    desiredQuantity: quantity.desiredQuantity,
  };
}

function resolveItemShapeFullyClaimed(
  item: Item,
  allowGroupFunds: boolean,
  metadata?: ItemDescriptionMetadata | null
): boolean {
  const quantity = sectionQuantityContext(item, metadata);
  const { fundingTarget, totalClaimedAmount } = resolveItemFundingSnapshot(item);
  return resolveItemSectionFullyClaimed({
    isFullyClaimed: item.IsFullyClaimed,
    isClaimed: item.IsClaimed,
    allowGroupFunds,
    fundingTarget,
    totalClaimedAmount,
    ...quantity,
  });
}

/** Fully-claimed for a parent or substitution browse section. */
export function resolveBrowseSectionFullyClaimed(
  parent: Item,
  entry: SubstitutionBrowseOption,
  allowGroupFunds: boolean
): boolean {
  if (entry.kind === 'original') {
    return resolveItemShapeFullyClaimed(parent, allowGroupFunds, parent.Metadata);
  }

  const child = entry.option?.Item;
  if (!child) return false;
  return resolveItemShapeFullyClaimed(
    substitutionSummaryAsItem(child),
    allowGroupFunds
  );
}

/** True when GF amounts meet target (for gray-out when claims are hidden). */
export function isBrowseSectionGfFullyFunded(
  parent: Item,
  entry: SubstitutionBrowseOption,
  allowGroupFunds: boolean
): boolean {
  const fundingSource =
    entry.kind === 'original'
      ? parent
      : entry.option?.Item
        ? {
            FundingTarget: entry.option.Item.FundingTarget,
            TotalClaimedAmount: entry.option.Item.TotalClaimedAmount,
            Links: entry.option.Item.Links ?? [],
            Claims: entry.option.Item.Claims ?? [],
          }
        : null;

  if (!fundingSource) return false;

  const { fundingTarget, totalClaimedAmount } =
    resolveItemFundingSnapshot(fundingSource);
  return isItemGroupFundingFullyFunded({
    allowGroupFunds,
    fundingTarget,
    totalClaimedAmount,
    isFullyClaimed: false,
  });
}

/** Fully-claimed for the active display item (card/showcase). */
export function resolveDisplayItemFullyClaimed(
  displayItem: Item,
  allowGroupFunds: boolean,
  metadata?: ItemDescriptionMetadata | null
): boolean {
  return resolveItemShapeFullyClaimed(displayItem, allowGroupFunds, metadata);
}
