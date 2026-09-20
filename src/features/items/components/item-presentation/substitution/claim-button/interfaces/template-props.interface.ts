import type { SubstitutionClaimButtonAppearance } from './props.interface';

export interface TemplateProps {
  mode: 'create' | 'manage';
  allowSubstitutions: boolean;
  showDisabledConfirm: boolean;
  showDeleteConfirm: boolean;
  warningOpen: boolean;
  disabled?: boolean;
  busy?: boolean;
  appearance?: SubstitutionClaimButtonAppearance;
  size?: 'sm' | 'md';
  className?: string;
  createLabel: string;
  editLabel: string;
  deleteLabel: string;
  warningText: string;
  onRequest: () => void;
  onDisabledConfirm: () => void;
  onDisabledCancel: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onWarningClose: () => void;
  onWarningContinue: () => void;
}
