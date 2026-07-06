import React from 'react';
import { ToolbarTemplateProps } from './interfaces/toolbar-template-props.interface';
import styles from './toolbar.module.css';

export const ToolbarTemplate: React.FC<ToolbarTemplateProps> = ({ toolbarLeft, toolbarRight }) => (
  <div className={styles.toolbar}>
    <div className={styles['toolbar-left']}>{toolbarLeft}</div>
    <div className={styles['toolbar-right']}>{toolbarRight}</div>
  </div>
);
