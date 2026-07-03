import React from 'react';
import { X } from 'lucide-react';
import { ToastTemplateProps } from './interfaces/toast-template-props.interface';
import styles from './toast.module.css';

export const ToastTemplate: React.FC<ToastTemplateProps> = ({
  message,
  onDismiss,
  toastClass,
}) => {
  return (
    <div className={toastClass} role="status" aria-live="polite">
      <p className={styles.message}>{message}</p>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss notification"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
