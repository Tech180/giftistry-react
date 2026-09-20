import React from 'react';
import { Toast as ToastComponent } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './host.module.css';

export const HostTemplate: React.FC<TemplateProps> = ({ toasts, onDismiss }) => {
  return (
    <div
      className = {
        styles['host']
      }
    >
      {toasts.map((toast) => (
        <ToastComponent
          key = {
            toast.id
          }
          message = {
            toast.message
          }
          type = {
            toast.type
          }
          onDismiss = {
            () => onDismiss(toast.id)
          }
          className = {
            styles['host__item']
          }
        />
      ))}
    </div>
  );
};
