import { Item } from 'features/items';

export interface MiniDrawerProps {
  items: Item[];
  selectedIds: string[];
  onRemoveId: (id: string) => void;
  isActive: boolean;
  position: 'left' | 'right';
  label?: string;
}
