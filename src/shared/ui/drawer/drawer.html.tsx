import React from 'react';
import { DrawerTemplateProps } from './interfaces/drawer-template-props.interface';
import styles from './drawer.module.css';

export const DrawerTemplate: React.FC<DrawerTemplateProps> = ({
  drawerClass,
  title,
  onClose,
  children,
  miniDrawer,
}) => {
  return (
    <div className={drawerClass}>
      {miniDrawer}
      <div className={styles.drawerPanel}>
        <div className={styles.drawerHeader}>
          <h4 className={styles.drawerTitle}>{title}</h4>
          <button onClick={onClose} className={styles.drawerClose}>
            &times;
          </button>
        </div>
        <div className={styles.drawerBody}>{children}</div>
      </div>
    </div>
  );
};
