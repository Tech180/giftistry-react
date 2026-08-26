import React from 'react';
import type { FabConfirmPanelProps } from './interfaces/fab-confirm-panel-props.interface';
import styles from './fab-confirm-panel.module.css';

export const FabConfirmPanel: React.FC<FabConfirmPanelProps> = ({
  message,
  tone = 'danger',
  yesLabel = 'Yes',
  noLabel = 'No',
  yesDisabled = false,
  onYes,
  onNo,
}) => {
  return (
    <div className={styles.root} role="group" aria-label="Confirm action">
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={[
            styles.btn,
            styles.yes,
            tone === 'warning' ? styles['yes--warning'] : '',
            tone === 'primary' ? styles['yes--primary'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={yesDisabled}
          onClick={onYes}
        >
          {yesLabel}
        </button>
        <button type="button" className={`${styles.btn} ${styles.no}`} onClick={onNo}>
          {noLabel}
        </button>
      </div>
    </div>
  );
};
