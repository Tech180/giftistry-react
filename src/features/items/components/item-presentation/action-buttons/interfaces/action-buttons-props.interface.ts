export interface ActionButtonsProps {
  isOwner: boolean;
  canCollaborate: boolean;
  isArchived?: boolean;
  claimedByCurrentUser: boolean;
  isFullyClaimed: boolean;
  claimLoading: boolean;
  showDeleteConfirm: boolean;
  deleteLoading: boolean;
  onEdit?: () => void;
  onClaim: () => void;
  onUnclaim: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  compact?: boolean;
  /** Stack on desktop; edit left / delete right on mobile. */
  splitOnMobile?: boolean;
}
