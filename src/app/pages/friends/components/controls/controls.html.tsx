import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './controls.module.css';

export const ControlsTemplate: React.FC<TemplateProps> = ({
  tabs,
  activeTab,
  onTabChange,
  filterQuery,
  onFilterChange,
  sortMethod,
  sortOptions,
  pendingCount,
  isSortOpen,
  dropdownRef,
  onToggleSort,
  onSelectSort,
}) => {
  const sortLabel = sortOptions.find((o) => o.id === sortMethod)?.label ?? sortMethod;

  return (
    <div className={styles['controls']}>
      <div className={styles['controls__tabs']}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={[
              styles['controls__tab'],
              activeTab === tab.id ? styles['controls__tab--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            {tab.id === 'requests' && pendingCount > 0 ? (
              <span className={styles['controls__tab-dot']} />
            ) : null}
          </button>
        ))}
      </div>

      {activeTab === 'current' ? (
        <div className={styles['controls__actions']}>
          <div className={styles['controls__filter']}>
            <Search size={14} className={styles['controls__filter-icon']} />
            <input
              type="text"
              placeholder="Filter..."
              value={filterQuery}
              onChange={(e) => onFilterChange(e.target.value)}
              className={styles['controls__filter-input']}
            />
          </div>

          <div className={styles['controls__sort']} ref={dropdownRef}>
            <button
              type="button"
              className={styles['controls__sort-button']}
              onClick={onToggleSort}
            >
              <SlidersHorizontal size={14} />
              <span>{sortLabel}</span>
            </button>

            {isSortOpen ? (
              <div className={styles['controls__sort-menu']}>
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={[
                      styles['controls__sort-item'],
                      sortMethod === option.id ? styles['controls__sort-item--active'] : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onSelectSort(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};
