import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export interface TemplateProps {
  streams: TimelineStreamLane[];
  counter: string;
  panelClassName: string;
  headerClassName: string;
  headerRowClassName: string;
  titleClassName: string;
  counterClassName: string;
  listClassName: string;
}
