import React, { useCallback, useEffect, useState } from 'react';
import { adminApi } from 'features/admin';
import type { ContentReport, ModerationComment } from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminModerationTabTemplate } from './admin-moderation-tab.html';
import { MODERATION_PAGE_SIZE } from './interfaces/admin-moderation-tab-template-props.interface';

export const AdminModerationTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const [commentsRes, reportsRes] = await Promise.all([
        adminApi.getModerationComments(commentsPage),
        adminApi.getReports('open', reportsPage),
      ]);
      setComments(commentsRes.Comments ?? []);
      setCommentsTotal(commentsRes.Total ?? 0);
      setReports(reportsRes.Reports ?? []);
      setReportsTotal(reportsRes.Total ?? 0);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load moderation data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [commentsPage, reportsPage, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const deleteComment = async (id: string) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await adminApi.deleteModerationComment(id);
      showToast('Comment removed', 'success');
      load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete comment', 'error');
    }
  };

  const resolveReport = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      await adminApi.resolveReport(id, status);
      showToast(`Report ${status}`, 'success');
      load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update report', 'error');
    }
  };

  return (
    <AdminModerationTabTemplate
      isLoading={isLoading}
      comments={comments}
      reports={reports}
      reportsPage={reportsPage}
      reportsTotal={reportsTotal}
      commentsPage={commentsPage}
      commentsTotal={commentsTotal}
      pageSize={MODERATION_PAGE_SIZE}
      onReportsPageChange={setReportsPage}
      onCommentsPageChange={setCommentsPage}
      onDeleteComment={deleteComment}
      onResolveReport={resolveReport}
      onUnlock={() => showToast('Access logged', 'info')}
    />
  );
};
