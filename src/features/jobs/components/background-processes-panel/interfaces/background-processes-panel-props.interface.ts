import type { BackgroundJobView } from '../../../interfaces/background-job.interface';

export interface BackgroundProcessesPanelProps {
  jobs: BackgroundJobView[];
  variant: 'user' | 'admin';
  title?: string;
  emptyLabel?: string;
  error?: string | null;
  onCancel: (jobId: string) => void;
  onSuspend: (jobId: string) => void;
  onResume: (jobId: string) => void;
  isLoading?: boolean;
}
