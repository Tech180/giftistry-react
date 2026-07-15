export type CollapsibleStripStatusTone = 'idle' | 'progress' | 'success' | 'error';

export interface CollapsibleStripStatus {
  tone: CollapsibleStripStatusTone;
  message: string;
}
