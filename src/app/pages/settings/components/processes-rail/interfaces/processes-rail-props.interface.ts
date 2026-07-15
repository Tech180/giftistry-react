import type { BackgroundJobsScope } from 'features/jobs';

export interface ProcessesRailProps {
  scope: BackgroundJobsScope;
  title?: string;
  onError: (message: string) => void;
}
