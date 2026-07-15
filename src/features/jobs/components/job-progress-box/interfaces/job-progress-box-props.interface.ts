import type { BackgroundJobView } from 'features/jobs';

export interface JobProgressBoxProps {
  job: BackgroundJobView;
  onCancel: () => void;
  isCancelling?: boolean;
}
