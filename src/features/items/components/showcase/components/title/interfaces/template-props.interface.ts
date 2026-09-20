import type { ItemSubstitutionKind } from '../../../../../interfaces/item-substitution.interface';
import type { Variant } from './variant.type';

export interface TemplateProps {
  variant: Variant;
  name: string;
  isLinkedToItems: boolean;
  isRelatedToItems: boolean;
  showSubstitutionBadge: boolean;
  substitutionKind: ItemSubstitutionKind | 'original';
  substitutionCreatedByUserId: string | null | undefined;
  titleClassName: string;
  linkedIconClassName: string;
}
