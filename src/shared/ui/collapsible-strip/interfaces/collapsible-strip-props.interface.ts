import type { ReactNode } from 'react';
import type { CollapsibleStripStatus } from './collapsible-strip-status.interface';

export interface CollapsibleStripProps {
  title: string;
  isExpanded: boolean;
  status?: CollapsibleStripStatus;
  headerEnd?: ReactNode;
  className?: string;
  children: ReactNode;
}
