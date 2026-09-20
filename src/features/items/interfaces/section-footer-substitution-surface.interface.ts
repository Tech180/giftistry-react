import type { ItemSubstitutionOption } from './item-substitution.interface';

export interface SectionFooterSubstitutionSurface {
  mode: 'create' | 'manage';
  allowSubstitutions: boolean;
  ownOption: ItemSubstitutionOption | null;
}
