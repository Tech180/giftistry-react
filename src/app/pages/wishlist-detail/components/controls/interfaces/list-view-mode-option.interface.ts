import type { ComponentType } from 'react';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import type { LucideProps } from 'lucide-react';

export interface ListViewModeOption {
  mode: ItemViewMode;
  Icon: ComponentType<LucideProps>;
  label: string;
  isActive: boolean;
}
