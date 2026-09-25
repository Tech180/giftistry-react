import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import type { ItemGroup } from '../../../interfaces/item-group.interface';
import type { Item } from 'features/items';
import type { ItemCardRender } from './item-card-render.interface';

export interface TemplateProps {
  items: Item[];
  groupedItems: ItemGroup[];
  collapsedGroupKeys: Set<string>;
  toggleGroupCollapsed: (categoryKey: string) => void;
  viewMode: ItemViewMode;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  canSuggest: boolean;
  canAutoAdd: boolean;
  openAutoAdd: () => void;
  openAddDrawer: () => void;
  allowGroupFunds: boolean;
  isOwner: boolean;
  compactTaggingActive: boolean;
  canShowTrailingActions: boolean;
  chevronSize: number;
  groupsClassName: string;
  buildItemCard: (item: Item, priorityLabel: string) => ItemCardRender;
  demoItemsTourTarget?: string;
  highlightedItemId?: string | null;
}
