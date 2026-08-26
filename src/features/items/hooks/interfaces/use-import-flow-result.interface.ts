import type { CollapsibleStripStatus } from 'shared/ui';
import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';
import type { ImportTimelineStep } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';
import type {
  ImportStripMode,
  ImportStripPhase,
} from 'features/items/components/import/import-strip/interfaces/import-strip-props.interface';

export interface UseImportFlowResult {
  mode: ImportStripMode;
  phase: ImportStripPhase;
  dropzoneError: string | null;
  errorMessage: string | null;
  uploadPercent: number;
  uploadLabel: string;
  fileName: string | null;
  wishlistTitle: string;
  setWishlistTitle: (value: string) => void;
  timelineSteps: ImportTimelineStep[];
  timelineStreams: TimelineStreamLane[];
  streamsCaption: string | null;
  createLabel: string;
  isBusy: boolean;
  canConfirm: boolean;
  canGrabInfo: boolean;
  grabInfoActive: boolean;
  grabInfoArmed: boolean;
  canOptimizeCategories: boolean;
  optimizeCategoriesActive: boolean;
  optimizeCategoriesArmed: boolean;
  allowAi: boolean;
  confirmLabel: string;
  successMessage: string | null;
  successTone: CollapsibleStripStatus['tone'];
  handleFileSelected: (file: File) => void;
  acceptPastedText: (text: string) => void;
  handleConfirm: () => void;
  resetState: () => void;
  handleGrabInfoChange: (checked: boolean) => void;
  handleOptimizeCategoriesChange: (checked: boolean) => void;
}
