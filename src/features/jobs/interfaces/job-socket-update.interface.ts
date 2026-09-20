import type { BackgroundJobView } from './background-job.interface';

export interface JobSocketUpdate {
  Type?: string;
  Job?: BackgroundJobView;
  Reason?: string;
  ItemId?: string;
  ActorUserId?: string;
}
