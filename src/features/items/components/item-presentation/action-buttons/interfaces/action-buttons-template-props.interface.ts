import type { ButtonProps } from 'shared/ui';
import type { ClaimerSubstitutionAction } from '../../../../interfaces/claimer-substitution-action.interface';

export type ActionButtonsLayoutMode =
  | 'owner-edit'
  | 'unclaim'
  | 'claimed'
  | 'unavailable'
  | 'claim'
  | 'update-claim';

export type ActionButtonsSize = NonNullable<ButtonProps['size']>;

export interface ActionButtonsTemplateProps {
  layoutMode: ActionButtonsLayoutMode | null;
  size: ActionButtonsSize;
  stackClassName: string;
  confirmClassName: string;
  claimLoading: boolean;
  showDeleteConfirm: boolean;
  deleteLoading: boolean;
  /** Suggestors: show edit/delete next to claim controls. */
  showSuggesterEditActions: boolean;
  onEdit?: () => void;
  onView?: () => void;
  onClaim: () => void;
  onUnclaim: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  unclaimDisabled: boolean;
  hasLinkedUnclaimPeers?: boolean;
  substitutionAction?: ClaimerSubstitutionAction | null;
}
