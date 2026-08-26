import React from 'react';
import {
  MAIN_ITEM_COUNTER_LABEL,
  SUBSTITUTION_COUNTER_LABEL,
} from '../../../../constants/substitution-messages.constant';
import type { SubstitutionCounterBadgeProps } from './interfaces/substitution-counter-badge-props.interface';
import styles from './counter-badge.module.css';

export const SubstitutionCounterBadge: React.FC<SubstitutionCounterBadgeProps> = ({
  activeIndex,
  total,
  isOriginal = activeIndex === 0,
  className = '',
}) => {
  if (isOriginal) {
    return (
      <span
        className={[styles.badge, styles['badge-main'], className].filter(Boolean).join(' ')}
        role="status"
      >
        {MAIN_ITEM_COUNTER_LABEL}
      </span>
    );
  }

  return (
    <span className={[styles.badge, className].filter(Boolean).join(' ')} role="status">
      <span className={styles['badge-label']}>{SUBSTITUTION_COUNTER_LABEL}</span>
      <span className={styles['badge-fraction']}>
        {/* Browse index 0 is Main Item; count substitutions only (1-based among alts). */}
        <span className={styles['fraction-numerator']}>{activeIndex}</span>
        <span className={styles['fraction-slash']}>/</span>
        <span className={styles['fraction-denominator']}>{Math.max(total - 1, 1)}</span>
      </span>
    </span>
  );
};
