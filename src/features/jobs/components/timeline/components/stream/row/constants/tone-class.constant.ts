import styles from '../row.module.css';

export const DOT_TONE_CLASS = {
  pending: '',
  active: styles['dot--active'] ?? '',
  done: styles['dot--done'] ?? '',
  error: styles['dot--error'] ?? '',
} as const;

export const STATUS_TONE_CLASS = {
  pending: '',
  active: styles['status--active'] ?? '',
  done: '',
  error: styles['status--error'] ?? '',
} as const;
