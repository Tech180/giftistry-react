import type { ItemSubstitutionOption } from '../../../interfaces/item-substitution.interface';

export type SubstitutionEditorState =
  | { mode: 'create'; kind: 'claimer_custom' | 'owner_approved' }
  | { mode: 'edit'; option: ItemSubstitutionOption };
