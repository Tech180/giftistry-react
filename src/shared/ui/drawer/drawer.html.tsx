import React from 'react';
import { DrawerTemplateProps } from './interfaces/drawer-template-props.interface';
import styles from './drawer.module.css';

export const DrawerTemplate: React.FC<DrawerTemplateProps> = ({
  drawerClass,
  drawerRef,
  title,
  onClose,
  children,
  miniDrawer,
}) => {
  return (
    <div ref={drawerRef} className={drawerClass}>
      {miniDrawer}
      <div className={styles['drawer-panel']}>
        <div className={styles['drawer-header']}>
          <h4 className={styles['drawer-title']}>{title}</h4>
          <button onClick={onClose} className={styles['drawer-close']}>
            &times;
          </button>
        </div>
        <div className={styles['drawer-body']}>{children}</div>
      </div>
    </div>
  );
};
