import type { Item } from 'features/items';

export interface ItemGroup {
  categoryKey: string;
  label: string;
  items: Item[];
}
