import React from 'react';
import type { NodeProps } from './interfaces/node-props.interface';
import styles from './node.module.css';

const toneClass: Record<string, string> = {
  pending: styles['node--pending'],
  active: styles['node--active'],
  done: styles['node--done'],
  error: styles['node--error'],
};

export const NodeTemplate: React.FC<NodeProps> = ({ tone }) => {
  return (
    <span
      className={[styles.node, toneClass[tone] || ''].filter(Boolean).join(' ')}
      aria-hidden
    >
      <span className={styles.inner} />
      <svg
        className={styles.check}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
};
