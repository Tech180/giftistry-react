import React from 'react';
import { ToastInfo } from './toast-info.interface';

export interface SettingsTemplateProps {
  routes: React.ReactNode;
  toasts: ToastInfo[];
  isAdmin: boolean;
}
