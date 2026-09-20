import type { ComponentType, ReactNode, MouseEvent } from 'react';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import type { LucideProps } from 'lucide-react';
import type { ListViewModeOption } from './list-view-mode-option.interface';

export interface TemplateProps {
  viewModeOptions: ListViewModeOption[];
  activeViewIcon: ComponentType<LucideProps>;
  activeViewLabel: string;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSelectViewMode: (mode: ItemViewMode, event?: MouseEvent<HTMLButtonElement>) => void;
  isViewModeMenuOpen: boolean;
  onViewModeMenuOpenChange: (open: boolean) => void;
  addItemWidget: ReactNode;
}
