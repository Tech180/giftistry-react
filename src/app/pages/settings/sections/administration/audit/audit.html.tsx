import React from 'react';
import { Download, RefreshCw, ScrollText } from 'lucide-react';
import { EnterPanel, Button } from 'shared/ui';
import { PaginationControls, SearchInput, SensitiveGate } from '../components';
import { AuditTemplateProps } from './interfaces/audit-template-props.interface';
import shared from '../shared.module.css';
import styles from './audit.module.css';

export const AuditTemplate: React.FC<AuditTemplateProps> = ({
  rows,
  action,
  page,
  totalPages,
  showPagination,
  isLoading,
  onActionChange,
  onRefresh,
  onPageChange,
  onExport,
  onUnlock,
}) => (
  <EnterPanel animation="fade" className={shared['admin__pane']}>
    <SensitiveGate
      title="Audit log access"
      description="This log contains PII including IP addresses and sensitive actor trails."
      icon={ScrollText}
      onUnlock={onUnlock}
    >
      <div className={shared['admin__page-header']}>
        <h1 className={shared['admin__page-title']}>Audit log</h1>
        <p className={shared['admin__page-subtitle']}>Immutable record of administrative and security events.</p>
      </div>

      <div className={shared['admin__toolbar']}>
        <SearchInput
          value={action}
          onChange={onActionChange}
          placeholder="Filter by event type, actor, or IP..."
        />
        <div className={styles['audit__toolbar-actions']}>
          <Button
            variant="secondary"
            size="sm"
            iconOnly
            onClick={onExport}
            leftIcon={<Download size={16} />}
            aria-label="Export audit log"
            title="Export"
          />
          <Button
            variant="secondary"
            size="sm"
            iconOnly
            onClick={onRefresh}
            leftIcon={<RefreshCw size={16} />}
            aria-label="Refresh audit log"
            title="Refresh"
          />
        </div>
      </div>

      {isLoading ? (
        <p className={shared['admin__empty']}>Loading audit log...</p>
      ) : rows.length === 0 ? (
        <p className={shared['admin__empty']}>No audit entries found.</p>
      ) : (
        <div className={`${shared['admin__table-wrap']} ${styles['audit__table-wrap--bordered']}`}>
          <table className={`${shared['admin__table']} ${styles['audit__table--mono']}`}>
            <thead className={styles['audit__table-header--mono']}>
              <tr>
                <th>Action</th>
                <th>Actor</th>
                <th>Target</th>
                <th>IP address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className={row.actionClassName}>{row.action}</td>
                  <td>{row.actorLabel}</td>
                  <td>{row.targetLabel}</td>
                  <td className={shared['admin__text-muted']}>{row.ipLabel}</td>
                  <td className={shared['admin__text-muted']}>{row.timestampLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPagination && (
        <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </SensitiveGate>
  </EnterPanel>
);
