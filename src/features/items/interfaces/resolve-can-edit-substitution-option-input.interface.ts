import type { ItemSubstitutionOption } from './item-substitution-option.interface';

export interface ResolveCanEditSubstitutionOptionInput {
  option: ItemSubstitutionOption;
  userId: string | null | undefined;
  canCollaborate: boolean;
}
