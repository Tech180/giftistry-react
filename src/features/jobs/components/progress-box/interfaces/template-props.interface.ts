import type { ImportTimelineStep } from 'features/items/components/import/strip/interfaces/import-timeline-step.interface';
import type { ImportJobSummary } from '../../../interfaces/import-job-summary.interface';
import type { TimelineStreamLane } from '../../../interfaces/job-timeline-view.interface';

export interface TemplateProps {
  title: string;
  message: string;
  error: string | null;
  isActive: boolean;
  isCancelling: boolean;
  onCancel: () => void;
  steps: ImportTimelineStep[];
  streams: TimelineStreamLane[] | undefined;
  streamsCaption: string | null | undefined;
  rootClassName: string;
  headerClassName: string;
  titleClassName: string;
  messageClassName: string;
  errorClassName: string;
}
