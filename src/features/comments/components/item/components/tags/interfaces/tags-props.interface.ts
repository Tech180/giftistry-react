import { Item } from 'features/items';

export type TagsAppearance = 'rail' | 'badges';

export interface TagsProps {
  taggedIds: string[];
  items: Item[];
  onItemTaggedClick?: (itemId: string) => void;
  /** `rail` = comment sidebar stack; `badges` = large tag boxes only. */
  appearance?: TagsAppearance;
}
