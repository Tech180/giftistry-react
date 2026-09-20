import React from 'react';
import { PriorityDisplay } from '../priority-display/priority-display.component';
import { AudienceIcon } from './components/audience-icon/audience-icon.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './badges.module.css';

export const BadgesTemplate: React.FC<TemplateProps> = ({
  audienceLabel,
  audienceIconKind,
  isPrivate,
  sharedWithCount,
  showPriority,
  priority,
}) => {
  return (
    <div className={styles.badges}>
      {audienceLabel && audienceIconKind ? (
        <>
          <span
            className={[
              styles['badges__badge'],
              styles['badges__badge--meta'],
              isPrivate ? styles['badges__badge--private'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <AudienceIcon
              kind = {
                audienceIconKind
              }
            />
            {audienceLabel}
          </span>
          {sharedWithCount > 0 ? (
            <span className={styles['badges__audience-count']}>+{sharedWithCount}</span>
          ) : null}
        </>
      ) : null}
      {showPriority && priority !== null ? (
        <PriorityDisplay
          priority = {
            priority
          }
          variant = {
            'badge'
          }
          className = {
            styles['badges__priority-end']
          }
        />
      ) : null}
    </div>
  );
};
