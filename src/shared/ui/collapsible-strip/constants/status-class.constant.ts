import type { CollapsibleStripStatusTone } from '../interfaces/collapsible-strip-status.interface';
import styles from '../collapsible-strip.module.css';

export const STATUS_CLASS: Record<CollapsibleStripStatusTone, string> = {
  idle: styles.statusIdle,
  progress: styles.statusProgress,
  success: styles.statusSuccess,
  error: styles.statusError,
};
