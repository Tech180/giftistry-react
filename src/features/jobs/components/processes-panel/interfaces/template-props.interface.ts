export interface ProcessRow {
  id: string;
  title: string;
  meta: string | null;
  message: string;
  status: string;
  percent: number;
  canSuspend: boolean;
  canResume: boolean;
  canCancel: boolean;
  isSuspended: boolean;
  progressLabel: string;
  statusBadgeClassName: string;
  fillClassName: string;
}

export interface TemplateProps {
  title: string;
  subtitle: string;
  emptyLabel: string;
  error: string | null;
  isLoadingEmpty: boolean;
  isEmpty: boolean;
  rows: ProcessRow[];
  onCancel: (jobId: string) => void;
  onSuspend: (jobId: string) => void;
  onResume: (jobId: string) => void;
  rootClassName: string;
  headerClassName: string;
  titleClassName: string;
  subtitleClassName: string;
  errorClassName: string;
  emptyClassName: string;
  listClassName: string;
  rowClassName: string;
  rowHeaderClassName: string;
  rowTopClassName: string;
  rowTitleClassName: string;
  rowMetaClassName: string;
  rowMessageClassName: string;
  trackClassName: string;
  actionsClassName: string;
}
