import type { ReactNode } from 'react';
import type { BackgroundJobsScope } from 'features/jobs';
import type { ToastInfo } from './toast-info.interface';

export interface PageTemplateProps {
  routes: ReactNode;
  toasts: ToastInfo[];
  isAdmin: boolean;
  isOwner: boolean;
  processesRailScope: BackgroundJobsScope | null;
  onProcessesError: (message: string) => void;
}
