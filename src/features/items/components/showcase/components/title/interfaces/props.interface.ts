import type { ItemSubstitutionKind } from '../../../../../interfaces/item-substitution.interface';
import type { Variant } from './variant.type';

export interface Props {
  variant: Variant;
  name: string;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  substitutionKind: ItemSubstitutionKind | 'original';
  substitutionCreatedByUserId?: string | null;
}
