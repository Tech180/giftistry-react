import React from 'react';
import { ErrorStateProps } from './interfaces/error-state-props.interface';
import { ErrorStateTemplate } from './error-state.html';
import styles from './error-state.module.css';

export type { ErrorStateProps } from './interfaces/error-state-props.interface';

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  retryLabel,
  className = '',
}) => {
  const containerClass = [styles.container, className].filter(Boolean).join(' ');

  return (
    <ErrorStateTemplate
      message={message}
      onRetry={onRetry}
      retryLabel={retryLabel}
      containerClass={containerClass}
    />
  );
};
