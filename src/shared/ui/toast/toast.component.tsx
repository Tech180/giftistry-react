import React from 'react';
import { ToastProps } from './interfaces/toast-props.interface';
import { ToastTemplate } from './toast.html';
import styles from './toast.module.css';

export type { ToastProps } from './interfaces/toast-props.interface';
export type { ToastType } from './interfaces/toast-type.interface';

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  onDismiss,
  className = '',
}) => {
  const toastClass = [styles.toast, styles[type], className].filter(Boolean).join(' ');

  return (
    <ToastTemplate message={message} type={type} onDismiss={onDismiss} toastClass={toastClass} />
  );
};
