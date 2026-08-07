export interface ItemQuantitySummary {
  isMultiCount: boolean;
  desiredQuantity: number;
  claimedQuantity: number;
  /** True when desired quantity is more than one and should show on list cards. */
  shouldDisplay: boolean;
  progressPercent: number;
}
