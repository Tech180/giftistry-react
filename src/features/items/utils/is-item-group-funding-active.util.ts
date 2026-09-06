import { isMoneyAmountAtLeast } from 'shared/utils/compare-money-amount.util';
import type { Item } from '../interfaces/item.interface';
import type { ItemFundingSnapshot } from '../interfaces/item-funding-snapshot.interface';
import type { ItemSubstitutionSummary } from '../interfaces/item-substitution.interface';

/**
 * True when group funding has started on this item (list allows GF, item has a
 * price target, and at least one positive contribution exists).
 */
export function isItemGroupFundingActive(input: {
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
}): boolean {
  return (
    input.allowGroupFunds &&
    input.fundingTarget > 0 &&
    input.totalClaimedAmount > 0
  );
}

type FundingSource = Pick<
  Item,
  'FundingTarget' | 'TotalClaimedAmount' | 'Links' | 'Claims'
>;

export function resolveItemFundingTarget(item: FundingSource): number {
  if (item.FundingTarget != null && item.FundingTarget > 0) {
    return item.FundingTarget;
  }
  return item.Links.reduce((max, link) => Math.max(max, link.ExtractedPrice || 0), 0);
}

export function resolveItemTotalClaimedAmount(item: FundingSource): number {
  if (item.TotalClaimedAmount != null) {
    return item.TotalClaimedAmount;
  }
  return item.Claims.reduce((sum, claim) => sum + (claim.Amount || 0), 0);
}

export function resolveItemFundingSnapshot(source: FundingSource): ItemFundingSnapshot {
  return {
    fundingTarget: resolveItemFundingTarget(source),
    totalClaimedAmount: resolveItemTotalClaimedAmount(source),
  };
}

/** GF target met by amounts or explicit fully-claimed flag. */
export function isItemGroupFundingFullyFunded(input: {
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  isFullyClaimed: boolean;
}): boolean {
  if (input.isFullyClaimed) {
    return true;
  }
  return (
    input.allowGroupFunds &&
    input.fundingTarget > 0 &&
    isMoneyAmountAtLeast(input.totalClaimedAmount, input.fundingTarget)
  );
}

export function isItemGroupFundingInProgress(input: {
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  isFullyClaimed: boolean;
}): boolean {
  return (
    isItemGroupFundingActive({
      allowGroupFunds: input.allowGroupFunds,
      fundingTarget: input.fundingTarget,
      totalClaimedAmount: input.totalClaimedAmount,
    }) && !isItemGroupFundingFullyFunded(input)
  );
}

/**
 * Resolves fully-claimed for claim chrome. GF items treat amount >= target as
 * fully claimed even when the API flag is still false.
 */
export function resolveActiveItemFullyClaimed(input: {
  isFullyClaimed?: boolean | null;
  isClaimed?: boolean;
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  isMultiCount: boolean;
  claimedQuantity: number;
  desiredQuantity: number;
}): boolean {
  if (input.isFullyClaimed === true) {
    return true;
  }

  if (input.isMultiCount) {
    if (input.isFullyClaimed != null) {
      return input.isFullyClaimed;
    }
    return input.claimedQuantity >= input.desiredQuantity;
  }

  if (isItemGroupFundingFullyFunded({
    allowGroupFunds: input.allowGroupFunds,
    fundingTarget: input.fundingTarget,
    totalClaimedAmount: input.totalClaimedAmount,
    isFullyClaimed: false,
  })) {
    return true;
  }

  if (input.isFullyClaimed != null) {
    return input.isFullyClaimed;
  }

  return input.isClaimed ?? false;
}

export function isItemGroupFundingActiveOnItem(
  item: Item,
  allowGroupFunds: boolean
): boolean {
  const snapshot = resolveItemFundingSnapshot(item);
  return isItemGroupFundingActive({
    allowGroupFunds,
    fundingTarget: snapshot.fundingTarget,
    totalClaimedAmount: snapshot.totalClaimedAmount,
  });
}

function substitutionSummaryAsFundingSource(
  child: ItemSubstitutionSummary
): FundingSource {
  return {
    FundingTarget: child.FundingTarget,
    TotalClaimedAmount: child.TotalClaimedAmount,
    Links: child.Links ?? [],
    Claims: child.Claims ?? [],
  };
}

/** True when the parent or any substitution child has active group funding. */
export function isItemGroupFundingActiveOnItemTree(
  item: Item,
  allowGroupFunds: boolean
): boolean {
  if (isItemGroupFundingActiveOnItem(item, allowGroupFunds)) {
    return true;
  }
  return (item.SubstitutionOptions ?? []).some((option) => {
    const snapshot = resolveItemFundingSnapshot(
      substitutionSummaryAsFundingSource(option.Item)
    );
    return isItemGroupFundingActive({
      allowGroupFunds,
      fundingTarget: snapshot.fundingTarget,
      totalClaimedAmount: snapshot.totalClaimedAmount,
    });
  });
}
