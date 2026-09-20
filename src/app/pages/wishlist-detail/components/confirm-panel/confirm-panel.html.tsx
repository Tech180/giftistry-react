import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './confirm-panel.module.css';

export const ConfirmPanelTemplate: React.FC<TemplateProps> = ({
  message,
  tone,
  yesLabel,
  noLabel,
  yesDisabled,
  onYes,
  onNo,
}) => {
  return (
    <div className={styles['confirm-panel']} role="group" aria-label="Confirm action">
      <p className={styles['confirm-panel__message']}>{message}</p>
      <div className={styles['confirm-panel__actions']}>
        <button
          type="button"
          className={[
            styles['confirm-panel__btn'],
            styles['confirm-panel__yes'],
            tone === 'warning' ? styles['confirm-panel__yes--warning'] : '',
            tone === 'primary' ? styles['confirm-panel__yes--primary'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          disabled={yesDisabled}
          onClick={onYes}
        >
          {yesLabel}
        </button>
        <button
          type="button"
          className={`${styles['confirm-panel__btn']} ${styles['confirm-panel__no']}`}
          onClick={onNo}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );
};
