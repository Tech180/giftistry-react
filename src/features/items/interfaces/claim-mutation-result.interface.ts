import type { Claim } from './item-claim.interface';

/** Partial item fields returned after claim/unclaim for local state patches. */
export interface ItemClaimMutationProjection {
  Id: string;
  Claims: Claim[];
  IsClaimed: boolean;
  IsFullyClaimed?: boolean;
  IsMultiCount?: boolean;
  TotalClaimedAmount?: number;
  TotalClaimedQuantity?: number;
  DesiredQuantity?: number | null;
  RemainingQuantity?: number | null;
  FundingTarget?: number;
}

export interface ClaimItemResult {
  Claims: Claim | Claim[];
  Items: ItemClaimMutationProjection[];
}

export interface UnclaimItemResult {
  Message?: string;
  Items: ItemClaimMutationProjection[];
}
