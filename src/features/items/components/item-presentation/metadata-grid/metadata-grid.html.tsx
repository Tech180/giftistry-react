import React from 'react';
import { PriorityDisplay } from '../priority-display/priority-display.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './metadata-grid.module.css';

export const MetadataGridTemplate: React.FC<TemplateProps> = ({
  variant,
  compactAlign,
  showPriority,
  priority,
  predefinedEntries,
  userDefinedEntries,
}) => {
  if (variant === 'compact') {
    return (
      <div
        className={`${styles['metadata-compact']} ${compactAlign === 'end' ? styles['metadata-compact-end'] : ''}`}
      >
        {showPriority && priority !== null ? (
          <PriorityDisplay
            priority = {
              priority
            }
            variant = {
              'chip'
            }
          />
        ) : null}
        {predefinedEntries.map((entry) => (
          <span key={entry.key} className={styles['metadata-chip']}>
            <span className={styles['metadata-chip-label']}>
              {entry.emoji ? (
                <span className={styles['metadata-chip-emoji']} aria-hidden="true">
                  {entry.emoji}
                </span>
              ) : null}
              {entry.label}
            </span>
            <span className={styles['metadata-chip-value']}>{entry.value}</span>
          </span>
        ))}
        {userDefinedEntries.map((entry) => (
          <span key={entry.key} className={styles['metadata-chip']}>
            <span className={styles['metadata-chip-label']}>{entry.label}</span>
            <span className={styles['metadata-chip-value']}>{entry.value}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={styles['metadata-grid']}>
      {showPriority && priority !== null ? (
        <PriorityDisplay
          priority = {
            priority
          }
          variant = {
            'chip'
          }
        />
      ) : null}
      {predefinedEntries.map((entry) => (
        <span key={entry.key} className={`${styles.badge} ${styles['badge-meta']}`}>
          {entry.emoji ? `${entry.emoji} ` : ''}
          <strong>{entry.label}:</strong> {entry.value}
        </span>
      ))}
      {userDefinedEntries.map((entry) => (
        <span key={entry.key} className={`${styles.badge} ${styles['badge-meta']}`}>
          <strong>{entry.label}:</strong> {entry.value}
        </span>
      ))}
    </div>
  );
};
