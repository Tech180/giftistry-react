import { Item } from 'features/items';

export interface MiniDrawerProps {
  items: Item[];
  selectedIds: string[];
  onRemoveId?: (id: string) => void;
  onItemClick?: (id: string) => void;
  isActive: boolean;
  position: 'left' | 'right';
  label?: string;
  /** When true, render as an in-panel strip inside a sheet sidebar. */
  inlineOnMobile?: boolean;
  /** Extra offset beyond 100% for stacked floating left rails (e.g. "4.875rem"). */
  edgeOffset?: string;
}
