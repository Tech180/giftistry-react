export interface ResolveClaimGroupFundAmountInput {
  allowGroupFunds: boolean;
  fundingTarget: number;
  totalClaimedAmount: number;
  /** Whether the claimer opted into the group-funding path. */
  groupFundingEnabled: boolean;
  /** Parsed contribution; null/NaN treated as unset. */
  amount: number | null;
}
