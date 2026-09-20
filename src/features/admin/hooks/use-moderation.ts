import { useEffect, useState } from 'react';
import { adminApi } from '../api/admin.api';
import { MODERATION_PAGE_SIZE } from '../constants/moderation-page-size.constant';
import type { ContentReport } from '../interfaces/content-report.interface';
import type { HookProps } from '../interfaces/hook-props.interface';
import type { ModerationComment } from '../interfaces/moderation-comment.interface';
import type { UseModerationResult } from '../interfaces/use-moderation-result.interface';

export function useModeration({ showToast }: HookProps): UseModerationResult {
  const [comments, setComments] = useState<ModerationComment[]>([]);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [reportsPage, setReportsPage] = useState(1);
  const [reportsTotal, setReportsTotal] = useState(0);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotal, setCommentsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
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
  };

  useEffect(() => {
    void load();
  }, [commentsPage, reportsPage]);

  const onDeleteComment = async (id: string) => {
    if (!window.confirm('Delete this comment?')) {
      return;
    }
    try {
      await adminApi.deleteModerationComment(id);
      showToast('Comment removed', 'success');
      void load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete comment', 'error');
    }
  };

  const onResolveReport = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      await adminApi.resolveReport(id, status);
      showToast(`Report ${status}`, 'success');
      void load();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update report', 'error');
    }
  };

  return {
    isLoading,
    comments,
    reports,
    reportsPage,
    reportsTotalPages: Math.max(1, Math.ceil(reportsTotal / MODERATION_PAGE_SIZE)),
    showReportsPagination: reportsTotal > MODERATION_PAGE_SIZE,
    commentsPage,
    commentsTotalPages: Math.max(1, Math.ceil(commentsTotal / MODERATION_PAGE_SIZE)),
    showCommentsPagination: commentsTotal > MODERATION_PAGE_SIZE,
    onReportsPageChange: setReportsPage,
    onCommentsPageChange: setCommentsPage,
    onDeleteComment,
    onResolveReport,
    onUnlock: () => showToast('Access logged', 'info'),
  };
}
