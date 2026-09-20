import styles from '../processes-panel.module.css';

export const STATUS_BADGE_TONE_CLASS: Record<string, string> = {
  running: styles['statusBadge--running'] ?? '',
  queued: styles['statusBadge--queued'] ?? '',
  suspended: styles['statusBadge--suspended'] ?? '',
};
