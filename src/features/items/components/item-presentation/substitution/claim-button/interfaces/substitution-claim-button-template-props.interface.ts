import type { SubstitutionClaimButtonAppearance } from './substitution-claim-button-props.interface';

export interface SubstitutionClaimButtonTemplateProps {
  mode: 'create' | 'manage';
  allowSubstitutions: boolean;
  showDisabledConfirm: boolean;
  showDeleteConfirm: boolean;
  disabled?: boolean;
  busy?: boolean;
  appearance?: SubstitutionClaimButtonAppearance;
  size?: 'sm' | 'md';
  className?: string;
  createLabel: string;
  editLabel: string;
  deleteLabel: string;
  onRequest: () => void;
  onDisabledConfirm: () => void;
  onDisabledCancel: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}
