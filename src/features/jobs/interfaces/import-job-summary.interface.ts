export type ImportJobSummaryTone = 'success' | 'info' | 'error';

export interface ImportJobSummary {
  message: string;
  tone: ImportJobSummaryTone;
  title: string;
}
