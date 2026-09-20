import type { Item } from '../../../interfaces/item.interface';

export interface Props {
  items: Item[];
  onRemoveId?: (id: string) => void;
  onItemClick?: (id: string) => void;
  className?: string;
}
