export interface ActionButtonsProps {
  isOwner: boolean;
  canCollaborate: boolean;
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
}
