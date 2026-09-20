import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export interface Props {
  streams: TimelineStreamLane[];
  caption?: string | null;
}
