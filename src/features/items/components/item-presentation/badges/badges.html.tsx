import React from 'react';
import { Eye } from 'lucide-react';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { BadgesProps } from './interfaces/badges-props.interface';
import styles from './badges.module.css';

export const Badges: React.FC<BadgesProps> = ({
  item,
  audienceLabel,
  isPrivate,
  showPriority = true,
}) => (
  <>
    {showPriority && hasPriorityValue(item.Priority) && (
      <span className={`${styles.badge} ${styles['badge-priority']}`}>
        Priority {item.Priority}
      </span>
    )}
    {item.IsSuggestion && (
      <span className={`${styles.badge} ${styles['badge-suggestion']}`}>
        Suggestion by {item.SuggestedByUsername || 'Collaborator'}
      </span>
    )}
    {audienceLabel && (
      <>
        <span className={`${styles.badge} ${styles['badge-meta']} ${isPrivate ? styles['badge-private'] : ''}`}>
          <Eye size={12} />
          {audienceLabel}
        </span>
        {audienceLabel === 'Shared with' && item.SharedWith && item.SharedWith.length > 0 && (
          <span className={styles['audience-count']}>+{item.SharedWith.length}</span>
        )}
      </>
    )}
  </>
);
