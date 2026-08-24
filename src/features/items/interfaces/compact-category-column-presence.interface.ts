export interface CompactCategoryColumnPresence {
  leading: boolean;
  select: boolean;
  /** Linked / related icons after the title. */
  relations: boolean;
  /** Claim / suggestion / sharing badges share one synced audience column. */
  audience: boolean;
  quantity: boolean;
  price: boolean;
  funding: boolean;
  trailing: boolean;
  /**
   * Guest claim controls (Claim / Unclaim / Unclaim All+Update / confirm strip)
   * share a synced width across the category.
   */
  claimActions: boolean;
  /** Any item in the group shows Unclaim All + Update claim controls. */
  wideClaimActions: boolean;
}

export interface CompactCategoryColumnPresenceOptions {
  allowGroupFunds: boolean;
  isTaggingModeActive: boolean;
  isOwner: boolean;
  currentUserId?: string | null;
  /** True when any card in the group may show link/view/edit/claim trailing controls. */
  canShowTrailingActions?: boolean;
}
