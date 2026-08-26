import type { ItemSubstitutionKind } from '../../../../../interfaces/item-substitution.interface';

export interface SubstitutionBadgeProps {
  kind: ItemSubstitutionKind | 'original';
  createdByUserId?: string | null;
  createdByDisplayName?: string;
}
