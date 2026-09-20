import type { ClaimerSubstitutionAction } from '../../../../../../interfaces/claimer-substitution-action.interface';
import type { ItemLink } from '../../../../../../interfaces/item-link.interface';
import type { ColClassResult } from '../../../interfaces/col-class-result.interface';

export interface Props {
  reserveTrailing: boolean;
  trailingCol: ColClassResult;
  primaryLink: ItemLink | undefined;
  primaryLinkTitle: string;
  primaryLinkAriaLabel: string;
  onView?: () => void;
  showCompactActions: boolean;
  canShowEditActions: boolean;
  onEdit?: () => void;
  setShowDeleteConfirm: (val: boolean) => void;
  showGuestClaimActions: boolean;
  claimActionsClassName: string;
  useSyncedClaimActionWidth: boolean;
  substitutionAction?: ClaimerSubstitutionAction | null;
  claimLoading: boolean;
  showClaimForm: boolean;
  claimedByCurrentUser: boolean;
  canAdjustClaim: boolean;
  handleUnclaim: () => void;
  setShowClaimForm: (val: boolean) => void;
  isClaimUnavailable: boolean;
  isFullyClaimed: boolean;
  unclaimLabel: string;
  actionsClassName: string;
  actionBtnDangerClassName: string;
  trailingClassName: string;
  actionBtnClassName: string;
  actionBtnClaimClassName: string;
  actionBtnClaimDangerClassName: string;
}
