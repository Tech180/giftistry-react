import type { SortMethod } from '../../../interfaces/sort-method.type';
import type { SortOption } from '../../../interfaces/sort-option.interface';
import type { Tab } from '../../../interfaces/tab.interface';
import type { TabId } from '../../../interfaces/tab-id.type';

export interface Props {
  tabs: readonly Tab[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  filterQuery: string;
  onFilterChange: (query: string) => void;
  sortMethod: SortMethod;
  onSortChange: (method: SortMethod) => void;
  sortOptions: readonly SortOption[];
  pendingCount: number;
}
