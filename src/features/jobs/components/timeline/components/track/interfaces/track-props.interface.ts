import type { ImportTimelineStep } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';
import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export interface TrackProps {
  steps: ImportTimelineStep[];
  streams?: TimelineStreamLane[];
  streamsCaption?: string | null;
}
