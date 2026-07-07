import React from 'react';
import { Download, ScrollText } from 'lucide-react';
import { EnterPanel, Button } from 'shared/ui';
import { AdminSearchInput, SensitiveGate } from '../components';
import { getAuditActionClass } from '../utils/audit.util';
import { AdminAuditTabTemplateProps } from './interfaces/admin-audit-tab-template-props.interface';
import styles from '../admin.shared.module.css';

export const AdminAuditTabTemplate: React.FC<AdminAuditTabTemplateProps> = ({
  entries,
  action,
  page,
  total,
  isLoading,
  onActionChange,
  onRefresh,
  onPageChange,
  onExport,
  onUnlock,
}) => {
  const totalPages = Math.ceil(total / 50);

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <SensitiveGate
        title="Audit log access"
        description="This log contains PII including IP addresses and sensitive actor trails."
        icon={ScrollText}
        onUnlock={onUnlock}
      >
        <div className={styles['page-header']}>
          <h1 className={styles['page-title']}>Audit log</h1>
          <p className={styles['page-subtitle']}>Immutable record of administrative and security events.</p>
        </div>

        <div className={styles.toolbar}>
          <AdminSearchInput
            value={action}
            onChange={onActionChange}
            placeholder="Filter by event type, actor, or IP..."
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={onExport} leftIcon={<Download size={14} />}>
              Export
            </Button>
            <Button variant="secondary" onClick={onRefresh}>
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className={styles.empty}>Loading audit log...</p>
        ) : entries.length === 0 ? (
          <p className={styles.empty}>No audit entries found.</p>
        ) : (
          <div className={`${styles['table-wrap']} ${styles['table-wrap-bordered']}`}>
            <table className={`${styles['linear-table']} ${styles['linear-table-mono']}`}>
              <thead className={styles['mono-header']}>
                <tr>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Target</th>
                  <th>IP address</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const actionClass = getAuditActionClass(entry.Action);
                  return (
                    <tr key={entry.Id}>
                      <td
                        className={
                          actionClass === 'primary'
                            ? styles['audit-action-primary']
                            : actionClass === 'error'
                              ? styles['audit-action-error']
                              : undefined
                        }
                      >
                        {entry.Action}
                      </td>
                      <td>{entry.ActorUsername ?? '—'}</td>
                      <td>{entry.TargetUsername ?? '—'}</td>
                      <td className={styles['text-muted']}>{entry.Ip ?? '—'}</td>
                      <td className={styles['text-muted']}>
                        {entry.CreatedAt ? new Date(entry.CreatedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {total > 50 && (
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
        )}
      </SensitiveGate>
    </EnterPanel>
  );
};
