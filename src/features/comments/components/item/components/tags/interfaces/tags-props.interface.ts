import { Item } from 'features/items';
import type { TagsAppearance } from './appearance.type';

export interface TagsProps {
  taggedIds: string[];
  items: Item[];
  onItemTaggedClick?: (itemId: string) => void;
  /** `rail` = comment sidebar stack; `badges` = large tag boxes only. */
  appearance?: TagsAppearance;
}
