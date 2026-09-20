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
