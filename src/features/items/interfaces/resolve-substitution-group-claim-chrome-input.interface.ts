import type { Item } from './item.interface';
import type { ItemSubstitutionOption } from './item-substitution.interface';
import type { SubstitutionBrowseOption } from './substitution-browse-option.interface';

export interface ResolveSubstitutionGroupClaimChromeInput {
  parent: Item;
  options: ItemSubstitutionOption[] | null | undefined;
  active: SubstitutionBrowseOption;
  userId: string | null | undefined;
  allowGroupFunds: boolean;
}
