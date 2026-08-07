import type { ComponentType, ReactNode, MouseEvent } from 'react';
import type { ItemViewMode } from 'features/items/types/item-view-mode.type';
import type { LucideProps } from 'lucide-react';

export interface ListViewModeOption {
  mode: ItemViewMode;
  Icon: ComponentType<LucideProps>;
  label: string;
  isActive: boolean;
}

export interface ListViewControlsTemplateProps {
  viewModeOptions: ListViewModeOption[];
  activeViewIcon: ComponentType<LucideProps>;
  activeViewLabel: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectViewMode: (mode: ItemViewMode, event?: MouseEvent<HTMLButtonElement>) => void;
  addItemWidget: ReactNode;
}
