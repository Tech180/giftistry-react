import type { Tab } from '../interfaces/tab.interface';

export const TABS: readonly Tab[] = [
  { id: 'current', label: 'My Friends' },
  { id: 'requests', label: 'Requests' },
  { id: 'search', label: 'Discover' },
] as const;
