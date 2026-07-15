import React from 'react';
import type { CollapsibleStripProps } from './interfaces/collapsible-strip-props.interface';
import { CollapsibleStripTemplate } from './collapsible-strip.html';
import styles from './collapsible-strip.module.css';

export type { CollapsibleStripProps } from './interfaces/collapsible-strip-props.interface';
export type {
  CollapsibleStripStatus,
  CollapsibleStripStatusTone,
} from './interfaces/collapsible-strip-status.interface';

const STATUS_CLASS: Record<string, string> = {
  idle: styles.statusIdle,
  progress: styles.statusProgress,
  success: styles.statusSuccess,
  error: styles.statusError,
};

export const CollapsibleStrip: React.FC<CollapsibleStripProps> = ({
  title,
  isExpanded,
  status,
  headerEnd,
  className = '',
  children,
}) => {
  if (!isExpanded) {
    return null;
  }

  const stripClass = [styles.strip, className].filter(Boolean).join(' ');
  const statusClass = [
    styles.status,
    STATUS_CLASS[status?.tone ?? 'idle'] ?? styles.statusIdle,
  ].join(' ');

  return (
    <CollapsibleStripTemplate
      title={title}
      status={status}
      headerEnd={headerEnd}
      stripClass={stripClass}
      statusClass={statusClass}
    >
      {children}
    </CollapsibleStripTemplate>
  );
};
