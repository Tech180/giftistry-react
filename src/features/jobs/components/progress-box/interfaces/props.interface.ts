import type { BackgroundJobView } from '../../../interfaces/background-job.interface';

export interface Props {
  job: BackgroundJobView;
  onCancel: () => void;
  isCancelling?: boolean;
}
