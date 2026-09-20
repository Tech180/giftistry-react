import type { ItemSubstitutionOption } from './item-substitution.interface';

export interface ResolveClaimerSubstitutionActionResult {
  visible: boolean;
  allowSubstitutions: boolean;
  mode: 'create' | 'manage';
  ownOption: ItemSubstitutionOption | null;
}
