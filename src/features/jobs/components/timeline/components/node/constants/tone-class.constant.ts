import styles from '../node.module.css';

export const NODE_TONE_CLASS = {
  pending: styles['node--pending'] ?? '',
  active: styles['node--active'] ?? '',
  done: styles['node--done'] ?? '',
  error: styles['node--error'] ?? '',
} as const;

export const INNER_TONE_CLASS = {
  pending: '',
  active: styles['inner--active'] ?? '',
  done: styles['inner--done'] ?? '',
  error: styles['inner--error'] ?? '',
} as const;
