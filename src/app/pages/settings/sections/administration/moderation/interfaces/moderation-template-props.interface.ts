import type { CommentRow } from './comment-row.interface';
import type { ReportRow } from './report-row.interface';

export interface ModerationTemplateProps {
  isLoading: boolean;
  reportRows: ReportRow[];
  commentRows: CommentRow[];
  reportsPage: number;
  reportsTotalPages: number;
  showReportsPagination: boolean;
  commentsPage: number;
  commentsTotalPages: number;
  showCommentsPagination: boolean;
  onReportsPageChange: (page: number) => void;
  onCommentsPageChange: (page: number) => void;
  onUnlock?: () => void;
}
