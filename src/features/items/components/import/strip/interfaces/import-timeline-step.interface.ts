export type ImportTimelineTone = 'pending' | 'active' | 'done' | 'error';

export type ImportTimelineStepId =
  | 'upload'
  | 'found'
  | 'created'
  | 'finalized'
  | 'grabInfo'
  | 'savedDetails';

export interface ImportTimelineStep {
  id: ImportTimelineStepId;
  label: string;
  /** Rate, counts, or elapsed shown under the step label (mono). */
  metric?: string | null;
  tone: ImportTimelineTone;
}
