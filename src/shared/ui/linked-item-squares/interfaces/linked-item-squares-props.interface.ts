import { Item } from 'features/items';

export interface LinkedItemSquaresProps {
  items: Item[];
  onRemoveId?: (id: string) => void;
  onItemClick?: (id: string) => void;
  className?: string;
}
