import type { ItemSubstitutionKind } from '../../../../../../../interfaces/item-substitution.interface';

export interface Props {
  name: string;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  showSubstitutionBadge: boolean;
  substitutionKind: ItemSubstitutionKind | 'original';
  substitutionCreatedByUserId: string | null | undefined;
  linkedIconClassName: string;
}
