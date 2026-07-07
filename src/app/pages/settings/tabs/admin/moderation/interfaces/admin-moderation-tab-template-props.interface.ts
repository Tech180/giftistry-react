import type { ContentReport, ModerationComment } from 'features/admin';

const PAGE_SIZE = 25;

export interface AdminModerationTabTemplateProps {
  isLoading: boolean;
  comments: ModerationComment[];
  reports: ContentReport[];
  reportsPage: number;
  reportsTotal: number;
  commentsPage: number;
  commentsTotal: number;
  pageSize: number;
  onReportsPageChange: (page: number) => void;
  onCommentsPageChange: (page: number) => void;
  onDeleteComment: (id: string) => void;
  onResolveReport: (id: string, status: 'resolved' | 'dismissed') => void;
  onUnlock?: () => void;
}

export { PAGE_SIZE as MODERATION_PAGE_SIZE };
