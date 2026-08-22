import React from 'react';
import { Package } from 'lucide-react';
import { WorkspacePromptIcon } from '../prompt-workspace-icon/prompt-workspace-icon.component';
import type { WorkspaceSidebarProps } from './interfaces/workspace-sidebar-props.interface';
import styles from './workspace-sidebar.module.css';

export const WorkspaceSidebarTemplate: React.FC<WorkspaceSidebarProps> = ({
  promptNavItems,
  directoryActive,
  enabledCount,
  onSelectPrompt,
  onSelectDirectory,
}) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles['nav-group']}>
        <p className={styles['nav-header']}>Core Prompts</p>
        <ul className={styles['nav-list']}>
          {promptNavItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles['nav-item']}${item.active ? ` ${styles['nav-item-active']}` : ''}`}
                aria-current={item.active ? 'true' : undefined}
                onClick={() => onSelectPrompt(item.id)}
              >
                <span className={styles['nav-item-left']}>
                  <span className={styles['nav-icon']}>
                    <WorkspacePromptIcon icon={item.icon} />
                  </span>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles['nav-group']}>
        <p className={styles['nav-header']}>Store</p>
        <ul className={styles['nav-list']}>
          <li>
            <button
              type="button"
              className={`${styles['nav-item']}${directoryActive ? ` ${styles['nav-item-active']}` : ''}`}
              aria-current={directoryActive ? 'true' : undefined}
              aria-label="Packs"
              onClick={onSelectDirectory}
            >
              <span className={styles['nav-item-left']}>
                <span className={styles['nav-icon']}>
                  <Package size={16} aria-hidden="true" />
                </span>
                Packs
              </span>
              <span className={styles['nav-badge']}>{enabledCount}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};
