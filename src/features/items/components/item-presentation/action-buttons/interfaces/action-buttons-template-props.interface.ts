import type { ButtonProps } from 'shared/ui';

export type ActionButtonsLayoutMode = 'owner-edit' | 'unclaim' | 'claimed' | 'claim';

export type ActionButtonsSize = NonNullable<ButtonProps['size']>;

export interface ActionButtonsTemplateProps {
  layoutMode: ActionButtonsLayoutMode;
  size: ActionButtonsSize;
  stackClassName: string;
  confirmClassName: string;
  claimLoading: boolean;
  showDeleteConfirm: boolean;
  deleteLoading: boolean;
  onEdit?: () => void;
  onClaim: () => void;
  onUnclaim: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}
