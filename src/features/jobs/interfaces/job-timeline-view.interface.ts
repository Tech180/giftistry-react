import type {
  ImportTimelineStep,
  ImportTimelineTone,
} from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';

export interface TimelineStreamLane {
  id: string;
  label: string;
  tone: ImportTimelineTone;
  /** Phase + optional tok/s, e.g. `Categorizing… · 40 tok/s`. */
  detail?: string | null;
  /** Full caption for title attribute. */
  caption?: string;
}

export interface JobTimelineView {
  steps: ImportTimelineStep[];
  streams: TimelineStreamLane[];
  streamsCaption: string | null;
  percent: number;
  label: string;
}
