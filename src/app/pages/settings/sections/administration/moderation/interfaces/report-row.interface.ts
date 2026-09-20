export interface ReportRow {
  id: string;
  targetType: string;
  reasonLabel: string;
  reporterLabel: string;
  onResolve: () => void;
  onDismiss: () => void;
}
