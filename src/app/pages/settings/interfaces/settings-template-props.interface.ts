import React from 'react';
import type { BackgroundJobsScope } from 'features/jobs';
import { ToastInfo } from './toast-info.interface';

export interface SettingsTemplateProps {
  routes: React.ReactNode;
  toasts: ToastInfo[];
  isAdmin: boolean;
  processesRailScope: BackgroundJobsScope | null;
  onProcessesError: (message: string) => void;
}
