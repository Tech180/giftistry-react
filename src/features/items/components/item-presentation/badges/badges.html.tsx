import React from 'react';
import { Eye, Globe, Lock } from 'lucide-react';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { BadgesProps } from './interfaces/badges-props.interface';
import styles from './badges.module.css';

function AudienceIcon({ label }: { label: string }) {
  if (label === 'Everyone') {
    return <Globe size={12} aria-hidden />;
  }
  if (label === 'Only Me') {
    return <Lock size={12} aria-hidden />;
  }
  return <Eye size={12} aria-hidden />;
}

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
          <AudienceIcon label={audienceLabel} />
          {audienceLabel}
        </span>
        {audienceLabel === 'Shared with' && item.SharedWith && item.SharedWith.length > 0 && (
          <span className={styles['audience-count']}>+{item.SharedWith.length}</span>
        )}
      </>
    )}
  </>
);
