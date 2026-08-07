import React from 'react';
import styles from '../../wishlist-detail.module.css';
import { ListViewControlsTemplateProps } from './interfaces/list-view-controls-template-props.interface';

export const ListViewControlsTemplate: React.FC<ListViewControlsTemplateProps> = ({
  viewModeOptions,
  activeViewIcon: ActiveViewIcon,
  activeViewLabel,
  searchQuery,
  onSearchQueryChange,
  onSelectViewMode,
  addItemWidget,
}) => (
  <div className={styles['column-header']}>
    <h3 className={styles['column-title']}>Gift Ideas</h3>
    <div className={styles['header-actions']}>
      <label className={styles['search-bar']}>
        <span className={styles['search-bar-icon']} aria-hidden>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className={styles['search-input']}
          aria-label="Search ideas"
        />
      </label>

      <div className={styles['view-switcher']} role="tablist" aria-label="Item view mode">
        {viewModeOptions.map(({ mode, Icon, label, isActive }) => (
          <button
            key={mode}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles['view-btn']} ${isActive ? styles['view-btn-active'] : ''}`}
            onClick={() => onSelectViewMode(mode)}
            title={`${label} View`}
            aria-label={`${label} View`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      <details className={styles['view-mode-menu']}>
        <summary
          className={styles['view-mode-trigger']}
          aria-label={`View options, current: ${activeViewLabel}`}
        >
          <ActiveViewIcon size={18} aria-hidden />
        </summary>
        <div className={styles['view-mode-panel']} role="menu" aria-label="Item view mode">
          {viewModeOptions.map(({ mode, Icon, label, isActive }) => (
            <button
              key={mode}
              type="button"
              role="menuitemradio"
              aria-checked={isActive}
              className={`${styles['view-mode-option']} ${isActive ? styles['view-mode-option-active'] : ''}`}
              onClick={(e) => onSelectViewMode(mode, e)}
            >
              <span className={styles['view-mode-option-icon']}>
                <Icon size={16} aria-hidden />
              </span>
              <span>{label} View</span>
            </button>
          ))}
        </div>
      </details>

      {addItemWidget}
    </div>
  </div>
);
