import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Sidebar } from 'shared/ui';
import type { ProcessesRailTemplateProps } from './interfaces/processes-rail-template-props.interface';
import styles from './processes-rail.module.css';

export const ProcessesRailTemplate: React.FC<ProcessesRailTemplateProps> = ({
  panelTitle,
  panelId,
  isCollapsed,
  onToggleCollapsed,
  children,
}) => {
  return (
    <aside
      className={`${styles.wrapper}${isCollapsed ? ` ${styles.collapsed}` : ''}`}
      aria-label={panelTitle}
    >
      <div
        id={panelId}
        className={`${styles.panel}${isCollapsed ? ` ${styles['panel-collapsed']}` : ''}`}
        inert={isCollapsed || undefined}
      >
        <Sidebar className={styles.sidebar}>{children}</Sidebar>
      </div>

      <button
        type="button"
        className={`${styles['edge-toggle']}${isCollapsed ? ` ${styles['edge-toggle-collapsed']}` : ''}`}
        aria-expanded={!isCollapsed}
        aria-controls={panelId}
        aria-label={isCollapsed ? 'Open background processes' : 'Close background processes'}
        onClick={onToggleCollapsed}
      >
        {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </aside>
  );
};
