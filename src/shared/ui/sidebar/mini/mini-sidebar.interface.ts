import { Item } from 'features/items/interfaces/item.interface';

export interface MiniSidebarProps {
  items: Item[];
  selectedIds: string[];
  onRemoveId: (id: string) => void;
  isActive: boolean;
  position: 'left' | 'right';
  label?: string;
}

export interface MiniSidebarTemplateProps extends MiniSidebarProps {
  sidebarClass: string;
  matchedItems: Item[];
}
