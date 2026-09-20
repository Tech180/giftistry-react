import type { ImportTimelineStep } from 'features/items/components/import/strip/interfaces/import-timeline-step.interface';
import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export interface TrackStepRow {
  step: ImportTimelineStep;
  isLast: boolean;
  filledConnector: boolean;
  activeConnector: boolean;
}

export interface TemplateProps {
  stepRows: TrackStepRow[];
  showStreams: boolean;
  streams: TimelineStreamLane[];
  streamsCaption: string | null;
  trackCols: string;
  hostClassName: string;
  trackClassName: string;
  streamsClassName: string;
}
