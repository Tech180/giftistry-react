import type { ReactNode } from 'react';
import type { Item } from '../../../../../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../../../../../interfaces/item-substitution.interface';
import type { SubstitutionBrowseOption } from '../../../../../utils/resolve-item-substitution-options.util';

export interface SubstitutionSwitcherProps {
  parent: Item;
  options?: ItemSubstitutionOption[] | null;
  userId?: string | null;
  /** Controlled browse index; omit to use claim-aware default. */
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  children: (active: SubstitutionBrowseOption, browse: SubstitutionBrowseOption[]) => ReactNode;
  className?: string;
}
