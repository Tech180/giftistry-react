import type { ButtonProps } from 'shared/ui';

export type ActionButtonsLayoutMode =
  | 'owner-edit'
  | 'unclaim'
  | 'claimed'
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
}
