import type { ItemSubstitutionKind } from '../../../../../interfaces/item-substitution.interface';

export interface Props {
  kind: ItemSubstitutionKind | 'original';
  createdByUserId?: string | null;
  createdByDisplayName?: string;
}
