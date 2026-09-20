import type { ContentReport } from './content-report.interface';
import type { ModerationComment } from './moderation-comment.interface';

export interface UseModerationResult {
  isLoading: boolean;
  comments: ModerationComment[];
  reports: ContentReport[];
  reportsPage: number;
  reportsTotalPages: number;
  showReportsPagination: boolean;
  commentsPage: number;
  commentsTotalPages: number;
  showCommentsPagination: boolean;
  onReportsPageChange: (page: number) => void;
  onCommentsPageChange: (page: number) => void;
  onDeleteComment: (id: string) => void;
  onResolveReport: (id: string, status: 'resolved' | 'dismissed') => void;
  onUnlock: () => void;
}
