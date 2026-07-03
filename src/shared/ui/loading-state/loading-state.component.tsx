import React from 'react';
import { LoadingStateProps } from './interfaces/loading-state-props.interface';
import { LoadingStateTemplate } from './loading-state.html';
import styles from './loading-state.module.css';

export type { LoadingStateProps } from './interfaces/loading-state-props.interface';

export const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  fullHeight = false,
  className = '',
}) => {
  const containerClass = [
    styles.container,
    fullHeight ? styles.fullHeight : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <LoadingStateTemplate
      message={message}
      fullHeight={fullHeight}
      containerClass={containerClass}
    />
  );
};
