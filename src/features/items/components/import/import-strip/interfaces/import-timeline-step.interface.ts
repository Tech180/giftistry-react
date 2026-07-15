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
  tone: ImportTimelineTone;
}

export function buildInitialTimelineSteps(
  mode: 'create-list' | 'existing-list'
): ImportTimelineStep[] {
  return [
    { id: 'upload', label: 'Upload', tone: 'done' },
    { id: 'found', label: 'Found items', tone: 'active' },
    {
      id: 'created',
      label: mode === 'create-list' ? 'Created wishlist' : 'Prepared wishlist',
      tone: 'pending',
    },
    { id: 'finalized', label: 'Finalized item selection', tone: 'pending' },
  ];
}

export const GRAB_INFO_TIMELINE_STEPS: ImportTimelineStep[] = [
  { id: 'grabInfo', label: 'Grab info', tone: 'pending' },
  { id: 'savedDetails', label: 'Saved details', tone: 'pending' },
];
