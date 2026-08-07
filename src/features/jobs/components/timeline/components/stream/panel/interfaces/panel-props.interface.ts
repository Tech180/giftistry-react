import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export interface PanelProps {
  streams: TimelineStreamLane[];
  caption?: string | null;
}
