import type { ImportTimelineStep } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';
import type { TimelineStreamLane } from '../../utils/map-job-to-timeline.util';

export interface JobImportTimelineProps {
  steps: ImportTimelineStep[];
  streams?: TimelineStreamLane[];
  streamsCaption?: string | null;
  className?: string;
}
