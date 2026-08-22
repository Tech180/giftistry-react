import React from 'react';
import { PriorityDisplayProps } from './interfaces/priority-display-props.interface';
import styles from './priority-display.module.css';

export const PriorityDisplay: React.FC<PriorityDisplayProps> = ({
  priority,
  variant = 'badge',
  showHint = false,
  className,
}) => {
  const variantClass =
    variant === 'rail'
      ? styles.rail
      : variant === 'rail-right'
        ? styles['rail-right']
        : variant === 'compact'
          ? styles.compact
      : variant === 'chip'
        ? styles.chip
        : variant === 'stacked'
          ? styles.stacked
          : variant === 'meta'
            ? styles.meta
            : styles.badge;

  return (
    <div
      className={`${styles['priority-display']} ${variantClass} ${className ?? ''}`.trim()}
      aria-label={`Priority ${priority}`}
    >
      <span className={styles.label}>Priority:</span>
      <span className={styles.value}>{priority}</span>
      {showHint && <span className={styles.hint}>(1 is highest)</span>}
    </div>
  );
};
