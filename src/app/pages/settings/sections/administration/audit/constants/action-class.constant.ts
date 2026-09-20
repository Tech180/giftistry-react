import styles from '../audit.module.css';

export const ACTION_CLASS: Record<'primary' | 'error', string> = {
  primary: styles['audit__action--primary']!,
  error: styles['audit__action--error']!,
};
