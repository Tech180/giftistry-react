import React from 'react';
import { ToastInfo } from './toast-info.interface';

export interface ProfileTemplateProps {
  routes: React.ReactNode;
  toasts: ToastInfo[];
  isAdmin: boolean;
}
