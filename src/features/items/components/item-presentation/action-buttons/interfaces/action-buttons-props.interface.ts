import type { ClaimerSubstitutionAction } from '../../../../interfaces/claimer-substitution-action.interface';

export interface ActionButtonsProps {
  isOwner: boolean;
  canCollaborate: boolean;
  isPublicGuest?: boolean;
  canEditItem?: boolean;
  isArchived?: boolean;
  isExpired?: boolean;
  claimedByCurrentUser: boolean;
  isFullyClaimed: boolean;
  /** Sibling substitution claim locks this section (label: Unavailable). */
  isClaimUnavailable?: boolean;
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
  /** When true, simple unclaim button reads "Unclaim all" (linked claim group). */
  hasLinkedUnclaimPeers?: boolean;
  /** Claimer custom substitution entry. */
  substitutionAction?: ClaimerSubstitutionAction | null;
}
