import React from 'react';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { MetadataGridProps } from './interfaces/metadata-grid-props.interface';
import styles from './metadata-grid.module.css';

export const MetadataGrid: React.FC<MetadataGridProps> = ({
  predefinedDisplayEntries,
  userDefinedEntries,
  metadataBadgeEmoji,
  priority,
  variant = 'badges',
}) => {
  const showPriority = hasPriorityValue(priority);

  if (predefinedDisplayEntries.length === 0 && userDefinedEntries.length === 0 && !showPriority) {
    return null;
  }

  if (variant === 'compact') {
    return (
      <div className={styles['metadata-compact']}>
        {showPriority && (
          <span className={`${styles['metadata-chip']} ${styles['metadata-chip-priority']}`}>
            <span className={styles['metadata-chip-label']}>Priority</span>
            <span className={styles['metadata-chip-value']}>{priority}</span>
          </span>
        )}
        {predefinedDisplayEntries.map((entry) => (
          <span key={entry.label} className={styles['metadata-chip']}>
            <span className={styles['metadata-chip-label']}>
              {metadataBadgeEmoji[entry.label] && (
                <span className={styles['metadata-chip-emoji']} aria-hidden="true">
                  {metadataBadgeEmoji[entry.label]}
                </span>
              )}
              {entry.label}
            </span>
            <span className={styles['metadata-chip-value']}>{entry.value}</span>
          </span>
        ))}
        {userDefinedEntries.map((field) => (
          <span key={field.name} className={styles['metadata-chip']}>
            <span className={styles['metadata-chip-label']}>{field.name}</span>
            <span className={styles['metadata-chip-value']}>{field.value}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={styles['metadata-grid']}>
      {predefinedDisplayEntries.map((entry) => (
        <span key={entry.label} className={`${styles.badge} ${styles['badge-meta']}`}>
          {metadataBadgeEmoji[entry.label] ? `${metadataBadgeEmoji[entry.label]} ` : ''}
          <strong>{entry.label}:</strong> {entry.value}
        </span>
      ))}
      {userDefinedEntries.map((field) => (
        <span key={field.name} className={`${styles.badge} ${styles['badge-meta']}`}>
          <strong>{field.name}:</strong> {field.value}
        </span>
      ))}
    </div>
  );
};
