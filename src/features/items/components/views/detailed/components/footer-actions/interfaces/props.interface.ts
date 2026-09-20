import type { ClaimerSubstitutionAction } from '../../../../../../interfaces/claimer-substitution-action.interface';

export interface Props {
  showActionButtons: boolean;
  footerClassName: string;
  showClaimForm: boolean;
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest: boolean | undefined;
  canEditItem: boolean | undefined;
  isArchived: boolean | undefined;
  isExpired: boolean;
  claimedByCurrentUser: boolean;
  isFullyClaimed: boolean;
  isClaimUnavailable: boolean | undefined;
  canAdjustClaim: boolean;
  claimLoading: boolean;
  showDeleteConfirm: boolean;
  deleteLoading: boolean;
  onEdit?: () => void;
  onView?: () => void;
  setShowClaimForm: (val: boolean) => void;
  handleUnclaim: () => void;
  setShowDeleteConfirm: (val: boolean) => void;
  handleDelete: () => void;
  hasLinkedUnclaimPeers: boolean;
  substitutionAction: ClaimerSubstitutionAction | null | undefined;
}
