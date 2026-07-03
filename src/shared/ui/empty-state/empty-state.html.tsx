import React from 'react';
import { EmptyStateTemplateProps } from './interfaces/empty-state-template-props.interface';
import styles from './empty-state.module.css';

export const EmptyStateTemplate: React.FC<EmptyStateTemplateProps> = ({
  icon,
  title,
  description,
  action,
  containerClass,
}) => {
  return (
    <div className={containerClass}>
      <div className={styles.icon} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};
