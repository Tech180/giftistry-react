import type { Item } from './item.interface';

export interface ItemListGroup {
  CategoryKey: string;
  CategoryLabel: string;
  Items: Item[];
}

export interface ItemListResult {
  Items: Item[];
  Groups: ItemListGroup[];
}
