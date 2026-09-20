import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';

export interface TemplateProps {
  lane: TimelineStreamLane;
  caption: string;
  isActive: boolean;
  statusLabel: string;
  rowClassName: string;
  topClassName: string;
  identityClassName: string;
  iconClassName: string;
  spinnerClassName: string;
  dotClassName: string;
  nameClassName: string;
  statusClassName: string;
}
