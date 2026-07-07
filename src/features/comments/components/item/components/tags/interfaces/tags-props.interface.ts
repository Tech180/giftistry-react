import { Item } from 'features/items';

export interface TagsProps {
  taggedIds: string[];
  items: Item[];
  onItemTaggedClick?: (itemId: string) => void;
}
