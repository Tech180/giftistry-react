import { Item } from 'features/items';

export interface MiniDrawerProps {
  items: Item[];
  selectedIds: string[];
  onRemoveId: (id: string) => void;
  onItemClick?: (id: string) => void;
  isActive: boolean;
  position: 'left' | 'right';
  label?: string;
  /** When true, render as an in-panel strip under 48rem (full-screen sheet parents). */
  inlineOnMobile?: boolean;
}
