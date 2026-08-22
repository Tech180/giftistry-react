export interface ActionButtonsVisibility {
  isOwner: boolean;
  canCollaborate: boolean;
  claimedByCurrentUser: boolean;
  isFullyClaimed: boolean;
  canAdjustClaim?: boolean;
  isPublicGuest?: boolean;
  canEditItem?: boolean;
  isArchived?: boolean;
  isExpired?: boolean;
}
