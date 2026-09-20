import React from 'react';
import { useModeration } from 'features/admin';
import { SectionProps } from '../interfaces/section-props.interface';
import { ModerationTemplate } from './moderation.html';
import type { CommentRow } from './interfaces/comment-row.interface';
import type { ReportRow } from './interfaces/report-row.interface';

export const Moderation: React.FC<SectionProps> = ({ showToast }) => {
  const {
    isLoading,
    comments,
    reports,
    reportsPage,
    reportsTotalPages,
    showReportsPagination,
    commentsPage,
    commentsTotalPages,
    showCommentsPagination,
    onReportsPageChange,
    onCommentsPageChange,
    onDeleteComment,
    onResolveReport,
    onUnlock,
  } = useModeration({ showToast });

  const reportRows: ReportRow[] = reports.map((report) => ({
    id: report.Id,
    targetType: report.TargetType ?? '—',
    reasonLabel: report.Reason || '—',
    reporterLabel: report.ReporterUsername ?? '—',
    onResolve: () => onResolveReport(report.Id, 'resolved'),
    onDismiss: () => onResolveReport(report.Id, 'dismissed'),
  }));

  const commentRows: CommentRow[] = comments.map((comment) => ({
    id: comment.Id,
    listTitle: comment.ListTitle ?? '—',
    authorLabel: comment.Username ?? comment.CommenterName ?? '—',
    contentLabel: comment.IsDeleted ? 'Deleted' : (comment.Content ?? '—'),
    isDeleted: !!comment.IsDeleted,
    onDelete: () => onDeleteComment(comment.Id),
  }));

  return (
    <ModerationTemplate
      isLoading={isLoading}
      reportRows={reportRows}
      commentRows={commentRows}
      reportsPage={reportsPage}
      reportsTotalPages={reportsTotalPages}
      showReportsPagination={showReportsPagination}
      commentsPage={commentsPage}
      commentsTotalPages={commentsTotalPages}
      showCommentsPagination={showCommentsPagination}
      onReportsPageChange={onReportsPageChange}
      onCommentsPageChange={onCommentsPageChange}
      onUnlock={onUnlock}
    />
  );
};
