import type { ReactNode } from 'react';
import type { ClaimerSubstitutionAction } from '../../../../../interfaces/claimer-substitution-action.interface';
import type { Mode } from './mode.type';

export interface TemplateProps {
  mode: Mode;
  showOwnerActions: boolean;
  showClaimForm: boolean;
  claimForm: ReactNode;
  ownerActions: ReactNode;
  substitutionAction: ClaimerSubstitutionAction | null;
  substitutionManageIconClassName: string | undefined;
  claimLoading: boolean;
  isClaimUnavailable: boolean;
  claimedByCurrentUser: boolean;
  primaryButtonLabel: string;
  primaryButtonVariant: 'primary' | 'secondary';
  unclaimLabel: string;
  unavailableLabel: string;
  onOpenClaimForm: () => void;
  onUnclaim: () => void;
  footerActionsClassName: string;
  claimWidgetClassName: string;
  claimButtonClassName: string;
  unclaimButtonClassName: string;
}
