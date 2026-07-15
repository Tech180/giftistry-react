import type { CollapsibleStripStatus } from 'shared/ui';
import type { ImportTimelineStep } from './import-timeline-step.interface';
import type { ImportStripMode, ImportStripPhase } from './import-strip-props.interface';
import type { TimelineStreamLane } from 'features/jobs/utils/map-job-to-timeline.util';

export interface ImportStripTemplateProps {
  mode: ImportStripMode;
  phase: ImportStripPhase;
  isExpanded: boolean;
  stripStatus?: CollapsibleStripStatus;
  title: string;
  dropzoneError: string | null;
  errorMessage: string | null;
  uploadPercent: number;
  uploadLabel: string;
  fileName: string | null;
  warnings: string[];
  wishlistTitle: string;
  setWishlistTitle: (value: string) => void;
  timelineSteps: ImportTimelineStep[];
  timelineStreams: TimelineStreamLane[];
  streamsCaption: string | null;
  createPercent: number;
  createLabel: string;
  isBusy: boolean;
  canConfirm: boolean;
  canGrabInfo: boolean;
  grabInfoActive: boolean;
  confirmLabel: string;
  className?: string;
  onFileSelected: (file: File) => void;
  onReset: () => void;
  onConfirm: () => void;
  onGrabInfo: () => void;
}
