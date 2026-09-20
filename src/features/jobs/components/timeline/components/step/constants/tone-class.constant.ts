import styles from '../step.module.css';

export const LABEL_TONE_CLASS = {
  pending: '',
  active: styles['label--active'] ?? '',
  done: styles['label--done'] ?? '',
  error: styles['label--error'] ?? '',
} as const;

export const METRIC_TONE_CLASS = {
  pending: '',
  active: styles['metric--active'] ?? '',
  done: '',
  error: styles['metric--error'] ?? '',
} as const;
