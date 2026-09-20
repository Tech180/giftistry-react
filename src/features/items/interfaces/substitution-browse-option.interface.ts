import type { ItemSubstitutionOption } from './item-substitution.interface';

export interface SubstitutionBrowseOption {
  key: string;
  kind: 'original' | 'owner_approved' | 'claimer_custom';
  label: string;
  itemId: string;
  substitutionId?: string;
  option?: ItemSubstitutionOption;
}
