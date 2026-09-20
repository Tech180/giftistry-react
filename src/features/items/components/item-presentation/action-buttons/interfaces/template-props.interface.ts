import type { ButtonProps } from 'shared/ui';
import type { ClaimerSubstitutionAction } from '../../../../interfaces/claimer-substitution-action.interface';
import type { ClaimPanel } from './claim-panel.type';
import type { Size } from './size.type';

export type ClaimVariant = NonNullable<ButtonProps['variant']>;

export interface TemplateProps {
  stackClassName: string;
  confirmClassName: string;
  iconBtnClassName: string;
  claimsClusterClassName: string;
  size: Size;
  /** ClaimButton only accepts sm|md (narrowed in the component). */
  claimButtonSize: 'sm' | 'md';
  bareClaimOnly: boolean;
  showLeading: boolean;
  showView: boolean;
  showEditor: boolean;
  showSubstitution: boolean;
  claimPanel: ClaimPanel;
  claimLabel: string;
  claimVariant: ClaimVariant;
  claimDisabled: boolean;
  claimClassName: string;
  claimOnClick: () => void;
  claimShowsLoading: boolean;
  updateUnclaimClassName: string;
  updateUnclaimDisabled: boolean;
  claimLoading: boolean;
  showDeleteConfirm: boolean;
  deleteLoading: boolean;
  substitutionAction: ClaimerSubstitutionAction | null;
  substitutionDisabled: boolean;
  substitutionClassName: string | undefined;
  onEdit?: () => void;
  onView?: () => void;
  onClaim: () => void;
  onUnclaim: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}
