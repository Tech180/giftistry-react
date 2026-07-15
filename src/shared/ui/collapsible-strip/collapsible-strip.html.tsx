import React from 'react';
import { EnterPanel } from '../enter-panel/enter-panel.component';
import type { CollapsibleStripTemplateProps } from './interfaces/collapsible-strip-template-props.interface';
import styles from './collapsible-strip.module.css';

export const CollapsibleStripTemplate: React.FC<CollapsibleStripTemplateProps> = ({
  title,
  status,
  headerEnd,
  stripClass,
  statusClass,
  children,
}) => {
  return (
    <EnterPanel animation="accordion" className={stripClass} role="region" aria-label={title}>
      <div className={styles.header}>
        <div className={styles.headerMain}>
          <p className={styles.title}>{title}</p>
          {status?.message ? (
            <p className={statusClass} role="status" aria-live="polite">
              {status.message}
            </p>
          ) : null}
        </div>
        {headerEnd ? <div className={styles.headerEnd}>{headerEnd}</div> : null}
      </div>
      <div className={styles.body}>{children}</div>
    </EnterPanel>
  );
};
