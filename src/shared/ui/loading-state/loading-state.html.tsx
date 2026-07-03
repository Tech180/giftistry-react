import React from 'react';
import { LoadingStateTemplateProps } from './interfaces/loading-state-template-props.interface';
import styles from './loading-state.module.css';

export const LoadingStateTemplate: React.FC<LoadingStateTemplateProps> = ({
  message = 'Loading...',
  containerClass,
}) => {
  return (
    <div className={containerClass} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
};
