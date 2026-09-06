import {
  isMoneyAmountAtLeast,
  moneyAmountLeftover,
} from 'shared/utils/compare-money-amount.util';

export interface ResolveClaimGroupFundAmountInput {
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  /** Whether the claimer opted into the group-funding path. */
  groupFundingEnabled: boolean;
  /** Parsed contribution; null/NaN treated as unset. */
  amount: number | null;
}

/**
 * Resolves the Amount sent to claimItem.
 * - Exclusive (`null`) when GF is off, toggled off, or paying the full target with no prior GF claims.
 * - Positive amount for start/contribute (including finishing leftover after GF started).
 */
export function resolveClaimGroupFundAmount(
  input: ResolveClaimGroupFundAmountInput
): number | null {
  const fundingTarget = Math.max(0, Number(input.fundingTarget) || 0);
  const totalClaimed = Math.max(0, Number(input.totalClaimedAmount) || 0);
  const leftover = moneyAmountLeftover(fundingTarget, totalClaimed);
  const hasPriorGroupFunding = totalClaimed > 0;
  const rawAmount = input.amount != null && Number.isFinite(input.amount) ? input.amount : null;

  if (!input.allowGroupFunds || fundingTarget <= 0) {
    return null;
  }

  if (!hasPriorGroupFunding && !input.groupFundingEnabled) {
    return null;
  }

  if (rawAmount == null || rawAmount <= 0) {
    return null;
  }

  const capped = Math.min(rawAmount, leftover > 0 ? leftover : rawAmount);

  if (!hasPriorGroupFunding && isMoneyAmountAtLeast(capped, fundingTarget)) {
    return null;
  }

  return capped;
}

export function claimGroupFundLeftover(
  fundingTarget: number,
  totalClaimedAmount: number
): number {
  return moneyAmountLeftover(fundingTarget, totalClaimedAmount);
}

export function isClaimGroupFundPathActive(input: {
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  multiCount: boolean;
  groupFundingEnabled: boolean;
}): boolean {
  if (input.multiCount || !input.allowGroupFunds || input.fundingTarget <= 0) {
    return false;
  }
  if (input.totalClaimedAmount > 0) {
    return true;
  }
  return input.groupFundingEnabled;
}
