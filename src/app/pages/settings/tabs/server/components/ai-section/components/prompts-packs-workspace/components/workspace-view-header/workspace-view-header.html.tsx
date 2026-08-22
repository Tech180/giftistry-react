import React from 'react';
import type { WorkspaceViewHeaderProps } from './interfaces/workspace-view-header-props.interface';
import styles from './workspace-view-header.module.css';

export const WorkspaceViewHeaderTemplate: React.FC<WorkspaceViewHeaderProps> = ({
  heading,
  leading,
  actions,
}) => {
  return (
    <header className={styles['view-header']}>
      <div className={styles['view-title']}>
        {leading}
        <h3 className={styles['view-title-text']}>{heading}</h3>
      </div>
      {actions ? <div className={styles['view-actions']}>{actions}</div> : null}
    </header>
  );
};
