export type ImportStripMode = 'existing-list' | 'create-list';

export type ImportStripPhase =
  | 'idle'
  | 'uploading'
  | 'ready'
  | 'creating'
  | 'success'
  | 'enriching'
  | 'error';

export interface ImportStripProps {
  mode: ImportStripMode;
  listId?: string;
  isExpanded: boolean;
  onImported: (result: {
    listId: string;
    jobId: string;
    created: number;
    failed: number;
  }) => void;
  className?: string;
}
