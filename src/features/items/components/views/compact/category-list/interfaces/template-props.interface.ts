import type { ReactNode, RefObject } from 'react';
import type { Item } from '../../../../../interfaces/item.interface';
import type { CompactColumnWidthCssVars } from '../../../../../interfaces/compact-column-widths.interface';
import type { ColumnSyncContextValue } from './column-sync-context-value.interface';

export interface TemplateProps {
  contextValue: ColumnSyncContextValue;
  containerRef: RefObject<HTMLDivElement | null>;
  id?: string;
  rootClassName: string;
  style: CompactColumnWidthCssVars;
  items: Item[];
  children: (item: Item) => ReactNode;
}
