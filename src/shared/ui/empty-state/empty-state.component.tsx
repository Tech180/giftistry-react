import React from 'react';
import { EmptyStateProps } from './interfaces/empty-state-props.interface';
import { EmptyStateTemplate } from './empty-state.html';
import styles from './empty-state.module.css';

export type { EmptyStateProps } from './interfaces/empty-state-props.interface';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const containerClass = [styles.container, className].filter(Boolean).join(' ');

  return (
    <EmptyStateTemplate
      icon={icon}
      title={title}
      description={description}
      action={action}
      containerClass={containerClass}
    />
  );
};
