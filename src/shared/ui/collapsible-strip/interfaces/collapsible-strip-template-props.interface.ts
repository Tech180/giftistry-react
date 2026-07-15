import type { ReactNode } from 'react';
import type { CollapsibleStripStatus } from './collapsible-strip-status.interface';

export interface CollapsibleStripTemplateProps {
  title: string;
  status?: CollapsibleStripStatus;
  headerEnd?: ReactNode;
  stripClass: string;
  statusClass: string;
  children: ReactNode;
}
