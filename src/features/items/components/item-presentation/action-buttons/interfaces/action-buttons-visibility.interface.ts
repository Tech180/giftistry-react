export interface ActionButtonsVisibility {
  isOwner: boolean;
  canCollaborate: boolean;
  claimedByCurrentUser: boolean;
  isFullyClaimed: boolean;
  /** Sibling substitution claim locks this section without claiming it. */
  isClaimUnavailable?: boolean;
  canAdjustClaim?: boolean;
  isPublicGuest?: boolean;
  canEditItem?: boolean;
  isArchived?: boolean;
  isExpired?: boolean;
}
