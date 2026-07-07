import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { EnterPanel, Button } from 'shared/ui';
import { SensitiveGate } from '../components/sensitive-gate';
import { AdminModerationTabTemplateProps } from './interfaces/admin-moderation-tab-template-props.interface';
import styles from '../admin.shared.module.css';

function PaginationControls({
  page,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (total <= pageSize) return null;

  return (
    <div className={styles['actions-row']}>
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className={styles['pagination-label']}>
        Page {page} of {totalPages}
      </span>
      <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}

export const AdminModerationTabTemplate: React.FC<AdminModerationTabTemplateProps> = ({
  isLoading,
  comments,
  reports,
  reportsPage,
  reportsTotal,
  commentsPage,
  commentsTotal,
  pageSize,
  onReportsPageChange,
  onCommentsPageChange,
  onDeleteComment,
  onResolveReport,
  onUnlock,
}) => {
  if (isLoading) return <p className={styles.empty}>Loading moderation queue...</p>;

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <SensitiveGate
        title="Restricted area"
        description="You are accessing user-generated content flagged for moderation. Viewer access is strictly audited."
        icon={ShieldAlert}
        onUnlock={onUnlock}
      >
        <div className={styles['page-header']}>
          <h1 className={styles['page-title']}>Moderation</h1>
          <p className={styles['page-subtitle']}>Review reported content and enforce community guidelines.</p>
        </div>

        <h2 className={styles['section-title']}>Open reports</h2>
        {reports.length === 0 ? (
          <p className={styles.empty}>No open reports.</p>
        ) : (
          <div className={`${styles['table-wrap']} ${styles['table-wrap-spaced']}`}>
            <table className={styles['linear-table']}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Reporter</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.Id}>
                    <td>{report.TargetType}</td>
                    <td>{report.Reason || '—'}</td>
                    <td className={styles['text-muted']}>{report.ReporterUsername ?? '—'}</td>
                    <td>
                      <button type="button" className={styles['link-btn']} onClick={() => onResolveReport(report.Id, 'resolved')}>
                        Resolve
                      </button>
                      {' · '}
                      <button type="button" className={styles['link-btn']} onClick={() => onResolveReport(report.Id, 'dismissed')}>
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <PaginationControls
          page={reportsPage}
          total={reportsTotal}
          pageSize={pageSize}
          onPageChange={onReportsPageChange}
        />

        <h2 className={`${styles['section-title']} ${styles['section-title-spaced']}`}>Flagged comments</h2>
        {comments.length === 0 ? (
          <p className={styles.empty}>No flagged comments.</p>
        ) : (
          <div className={styles['table-wrap']}>
            <table className={styles['linear-table']}>
              <thead>
                <tr>
                  <th>Context</th>
                  <th>Author</th>
                  <th>Content snippet</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.Id}>
                    <td>{comment.ListTitle}</td>
                    <td className={styles['text-muted']}>{comment.Username ?? comment.CommenterName}</td>
                    <td className={styles['content-cell']}>
                      {comment.IsDeleted ? <em>Deleted</em> : comment.Content}
                    </td>
                    <td>
                      {!comment.IsDeleted && (
                        <button
                          type="button"
                          className={`${styles['link-btn']} ${styles['danger-btn']}`}
                          onClick={() => onDeleteComment(comment.Id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <PaginationControls
          page={commentsPage}
          total={commentsTotal}
          pageSize={pageSize}
          onPageChange={onCommentsPageChange}
        />
      </SensitiveGate>
    </EnterPanel>
  );
};
