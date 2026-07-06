import React from 'react';
import { ErrorStateTemplateProps } from './interfaces/error-state-template-props.interface';
import styles from './error-state.module.css';

export const ErrorStateTemplate: React.FC<ErrorStateTemplateProps> = ({
  message,
  onRetry,
  retryLabel = 'Try again',
  containerClass,
}) => {
  return (
    <div className={containerClass} role="alert">
      <span className={styles.icon} aria-hidden="true">
        !
      </span>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button type="button" className={styles['retry-button']} onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  );
};
