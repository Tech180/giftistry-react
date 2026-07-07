import React from 'react';
import { ReactionsProps } from './interfaces/reactions-props.interface';
import styles from './reactions.module.css';

export const ReactionsTemplate: React.FC<ReactionsProps> = ({
  commentId,
  reactionsMap,
  toggleReaction,
}) => {
  const hasReactions = Object.keys(reactionsMap).length > 0;

  if (!hasReactions) return null;

  return (
    <div className={styles['reactions-footer']}>
      <div className={styles['reactions-list']}>
        {Object.entries(reactionsMap).map(([reaction, data]) => (
          <button
            key={reaction}
            type="button"
            onClick={() => toggleReaction?.(commentId, reaction)}
            className={`${styles['reaction-badge']} ${data.hasReacted ? styles['reaction-badge-active'] : ''}`}
            title={data.users.join(', ')}
          >
            <span className={styles['reaction-emoji']}>{reaction}</span>
            {data.count > 1 && (
              <span className={styles['reaction-count']}>{data.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
