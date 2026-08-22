export interface ActionButtonsProps {
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  canEditItem?: boolean;
  isArchived?: boolean;
  isExpired?: boolean;
  claimedByCurrentUser: boolean;
  isFullyClaimed: boolean;
  canAdjustClaim?: boolean;
  claimLoading: boolean;
  showDeleteConfirm: boolean;
  deleteLoading: boolean;
  onEdit?: () => void;
  onView?: () => void;
  onClaim: () => void;
  onUnclaim: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  compact?: boolean;
  /** Full-width footer row; claim left / editor actions right when both present. */
  splitOnMobile?: boolean;
  unclaimDisabled?: boolean;
}
