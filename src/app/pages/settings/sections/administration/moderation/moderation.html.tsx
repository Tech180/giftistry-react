import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { EnterPanel } from 'shared/ui';
import { PaginationControls, SensitiveGate } from '../components';
import { ModerationTemplateProps } from './interfaces/moderation-template-props.interface';
import shared from '../shared.module.css';
import styles from './moderation.module.css';

export const ModerationTemplate: React.FC<ModerationTemplateProps> = ({
  isLoading,
  reportRows,
  commentRows,
  reportsPage,
  reportsTotalPages,
  showReportsPagination,
  commentsPage,
  commentsTotalPages,
  showCommentsPagination,
  onReportsPageChange,
  onCommentsPageChange,
  onUnlock,
}) => {
  if (isLoading) return <p className={shared['admin__empty']}>Loading moderation queue...</p>;

  return (
    <EnterPanel animation="fade" className={shared['admin__pane']}>
      <SensitiveGate
        title="Restricted area"
        description="You are accessing user-generated content flagged for moderation. Viewer access is strictly audited."
        icon={ShieldAlert}
        onUnlock={onUnlock}
      >
        <div className={shared['admin__page-header']}>
          <h1 className={shared['admin__page-title']}>Moderation</h1>
          <p className={shared['admin__page-subtitle']}>Review reported content and enforce community guidelines.</p>
        </div>

        <h2 className={shared['admin__section-title']}>Open reports</h2>
        {reportRows.length === 0 ? (
          <p className={shared['admin__empty']}>No open reports.</p>
        ) : (
          <div className={`${shared['admin__table-wrap']} ${styles['moderation__table-wrap--spaced']}`}>
            <table className={shared['admin__table']}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Reporter</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.targetType}</td>
                    <td>{row.reasonLabel}</td>
                    <td className={shared['admin__text-muted']}>{row.reporterLabel}</td>
                    <td>
                      <button type="button" className={shared['admin__link']} onClick={row.onResolve}>
                        Resolve
                      </button>
                      {' · '}
                      <button type="button" className={shared['admin__link']} onClick={row.onDismiss}>
                        Dismiss
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showReportsPagination && (
          <PaginationControls
            page={reportsPage}
            totalPages={reportsTotalPages}
            onPageChange={onReportsPageChange}
          />
        )}

        <h2 className={`${shared['admin__section-title']} ${shared['admin__section-title--spaced']}`}>
          Flagged comments
        </h2>
        {commentRows.length === 0 ? (
          <p className={shared['admin__empty']}>No flagged comments.</p>
        ) : (
          <div className={shared['admin__table-wrap']}>
            <table className={shared['admin__table']}>
              <thead>
                <tr>
                  <th>Context</th>
                  <th>Author</th>
                  <th>Content snippet</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {commentRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.listTitle}</td>
                    <td className={shared['admin__text-muted']}>{row.authorLabel}</td>
                    <td className={styles['moderation__content']}>
                      {row.isDeleted ? <em>{row.contentLabel}</em> : row.contentLabel}
                    </td>
                    <td>
                      {!row.isDeleted && (
                        <button
                          type="button"
                          className={`${shared['admin__link']} ${styles['moderation__link--danger']}`}
                          onClick={row.onDelete}
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
        {showCommentsPagination && (
          <PaginationControls
            page={commentsPage}
            totalPages={commentsTotalPages}
            onPageChange={onCommentsPageChange}
          />
        )}
      </SensitiveGate>
    </EnterPanel>
  );
};
