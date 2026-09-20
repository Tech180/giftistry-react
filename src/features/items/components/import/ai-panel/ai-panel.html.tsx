import React from 'react';
import { Switch } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './ai-panel.module.css';

export const AiPanelTemplate: React.FC<TemplateProps> = ({
  active,
  grabSwitchId,
  optimizeSwitchId,
  grabArmed,
  optimizeArmed,
  canOptimizeCategories,
  disabled = false,
  onGrabChange,
  onOptimizeChange,
}) => {
  return (
    <div
      className={[styles['ai-panel'], active ? styles['ai-panel--active'] : '']
        .filter(Boolean)
        .join(' ')}
      role="group"
      aria-label="AI Features"
    >
      <span
        className={[
          styles['ai-panel__glow'],
          active ? styles['ai-panel__glow--active'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden
      />
      <div className={styles['ai-panel__inner']}>
        <div className={styles['ai-panel__header']}>
          <span
            className={[
              styles['ai-panel__title'],
              active ? styles['ai-panel__title--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            AI Processing
          </span>
        </div>
        <div className={styles['ai-panel__toggles']}>
          <div className={styles['ai-panel__toggle']}>
            <Switch
              id={grabSwitchId}
              size="sm"
              checked={grabArmed}
              onChange={onGrabChange}
              disabled={disabled}
              aria-label={
                grabArmed
                  ? 'Grab info on. Turn off to skip looking up item details.'
                  : 'Grab info off. Turn on to look up missing item details.'
              }
            />
            <label className={styles['ai-panel__toggle-label']} htmlFor={grabSwitchId}>
              Grab info
            </label>
          </div>
          {canOptimizeCategories ? (
            <div className={styles['ai-panel__toggle']}>
              <Switch
                id={optimizeSwitchId}
                size="sm"
                checked={grabArmed && optimizeArmed}
                onChange={onOptimizeChange}
                disabled={disabled || !grabArmed}
                aria-label={
                  !grabArmed
                    ? 'Optimize categories. Enable Grab info first.'
                    : optimizeArmed
                      ? 'Optimize categories on. Turn off to keep categories from the file except uncategorized.'
                      : 'Optimize categories off. Categories from the file are kept except uncategorized. Turn on to let AI optimize.'
                }
              />
              <label
                className={[
                  styles['ai-panel__toggle-label'],
                  !grabArmed ? styles['ai-panel__toggle-label--muted'] : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                htmlFor={optimizeSwitchId}
              >
                Optimize categories
              </label>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
