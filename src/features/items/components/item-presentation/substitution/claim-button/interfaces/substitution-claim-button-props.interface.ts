export type SubstitutionClaimButtonAppearance = 'secondary' | 'ghost-text';
export type SubstitutionClaimButtonMode = 'create' | 'manage';

export interface SubstitutionClaimButtonProps {
  allowSubstitutions: boolean;
  mode?: SubstitutionClaimButtonMode;
  disabled?: boolean;
  appearance?: SubstitutionClaimButtonAppearance;
  size?: 'sm' | 'md';
  className?: string;
  /** Opens the drawer substitution editor (create or edit). */
  onOpenEditor: () => void;
  /** Deletes the caller's own custom substitution (manage mode). */
  onDelete?: () => void | Promise<void>;
}
