import React from 'react';
import styles from './sidebar.module.css';

interface SidebarTemplateProps {
  sidebarClass: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  overflowVisible?: boolean;
}

export const SidebarTemplate: React.FC<SidebarTemplateProps> = ({
  sidebarClass,
  title,
  onClose,
  children,
  overflowVisible = false,
}) => {
  return (
    <div className={sidebarClass}>
      <div className={styles.sidebarPanel}>
        <div className={styles.sidebarHeader}>
          <h4 className={styles.sidebarTitle}>{title}</h4>
          <button onClick={onClose} className={styles.sidebarClose}>
            &times;
          </button>
        </div>
        <div className={`${styles.sidebarBody} ${overflowVisible ? styles.overflowVisible : ''}`}>{children}</div>
      </div>
    </div>
  );
};
