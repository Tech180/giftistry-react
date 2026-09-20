export { CategoryList } from './category-list.component';
export {
  ColumnSyncContext,
  useColumnSyncContext,
} from './hooks/use-column-sync-context';
export { DEFAULT_COLUMN_PRESENCE } from './constants/default-column-presence.constant';
export type { ColumnSyncContextValue } from './interfaces/column-sync-context-value.interface';
export type { Props } from './interfaces/props.interface';

/** Public / legacy aliases */
export { CategoryList as CompactCategoryList } from './category-list.component';
export {
  ColumnSyncContext as CompactColumnSyncContext,
  useColumnSyncContext as useCompactColumnSyncContext,
} from './hooks/use-column-sync-context';
export { DEFAULT_COLUMN_PRESENCE as DEFAULT_COMPACT_COLUMN_PRESENCE } from './constants/default-column-presence.constant';
export type { ColumnSyncContextValue as CompactColumnSyncContextValue } from './interfaces/column-sync-context-value.interface';
export type { Props as CompactCategoryListProps } from './interfaces/props.interface';
