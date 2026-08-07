import React from 'react';
import type { RowProps } from './interfaces/row-props.interface';
import styles from './row.module.css';

const toneClass: Record<string, string> = {
  pending: styles['row--pending'],
  active: styles['row--active'],
  done: styles['row--done'],
  error: styles['row--error'],
};

function statusText(lane: RowProps['lane']): string {
  if (lane.detail) return lane.detail;
  if (lane.tone === 'active') return 'Running';
  if (lane.tone === 'error') return 'Failed';
  if (lane.tone === 'done') return 'Done';
  return 'Pending';
}

export const RowTemplate: React.FC<RowProps> = ({ lane }) => {
  const caption = lane.caption || lane.label;
  const isActive = lane.tone === 'active';

  return (
    <li
      className={[styles.row, toneClass[lane.tone] || ''].filter(Boolean).join(' ')}
      title={caption}
    >
      <div className={styles.top}>
        <div className={styles.identity}>
          <span className={styles.icon} aria-hidden>
            {isActive ? (
              <svg
                className={styles.spinner}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              <span className={styles.dot} />
            )}
          </span>
          <span className={styles.name}>{lane.label}</span>
        </div>
        <span className={styles.status}>{statusText(lane)}</span>
      </div>
    </li>
  );
};
