import type { ItemSubstitutionOption } from './item-substitution.interface';

export interface ClaimerSubstitutionAction {
  mode: 'create' | 'manage';
  allowSubstitutions: boolean;
  /** Opens create editor, or edit for the caller's own custom substitution. */
  onRequest: () => void;
  /** Deletes the caller's own custom substitution (manage mode only). */
  onDelete?: () => void | Promise<void>;
  ownOption?: ItemSubstitutionOption | null;
}
