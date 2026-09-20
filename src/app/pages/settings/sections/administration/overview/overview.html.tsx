import React from 'react';
import { Link } from 'react-router-dom';
import { EnterPanel, Button } from 'shared/ui';
import { OverviewTemplateProps } from './interfaces/overview-template-props.interface';
import shared from '../shared.module.css';
import styles from './overview.module.css';

export const OverviewTemplate: React.FC<OverviewTemplateProps> = ({
  isLoading,
  stats,
  showMaintenanceBadge,
  recentAuditRows,
}) => {
  if (isLoading) return <div className={shared['admin__empty']}>Loading overview...</div>;

  return (
    <EnterPanel animation="fade" className={shared['admin__pane']}>
      <div className={shared['admin__page-header']}>
        <h1 className={shared['admin__page-title']}>Overview</h1>
        <p className={shared['admin__page-subtitle']}>Instance health and high-level platform metrics.</p>
      </div>

      {stats && (
        <div className={styles['overview__stats']}>
          <div className={styles['overview__stat']}>
            <span className={styles['overview__stat-label']}>Total users</span>
            <span className={styles['overview__stat-value']}>{stats.totalUsers}</span>
          </div>
          <div className={styles['overview__stat']}>
            <span className={styles['overview__stat-label']}>Active (7d)</span>
            <span className={styles['overview__stat-value']}>{stats.active7d}</span>
          </div>
          <div className={styles['overview__stat']}>
            <span className={styles['overview__stat-label']}>Disabled</span>
            <span className={styles['overview__stat-value']}>{stats.disabled}</span>
          </div>
          <div className={styles['overview__stat']}>
            <span className={styles['overview__stat-label']}>Locked</span>
            <span className={styles['overview__stat-value']}>{stats.locked}</span>
          </div>
          <div className={styles['overview__stat']}>
            <span className={styles['overview__stat-label']}>Wishlists</span>
            <span className={styles['overview__stat-value']}>{stats.activeLists}</span>
          </div>
          <div className={styles['overview__stat']}>
            <span className={styles['overview__stat-label']}>Open reports</span>
            <span className={styles['overview__stat-value']}>{stats.openReports}</span>
          </div>
        </div>
      )}

      <div className={shared['admin__actions']}>
        <Link to="/settings/admin/users">
          <Button variant="secondary">Manage users</Button>
        </Link>
        <Link to="/settings/admin/site">
          <Button variant="secondary">Site policy</Button>
        </Link>
        {showMaintenanceBadge && (
          <span className={`${shared['admin__badge']} ${shared['admin__badge--locked']}`}>
            Maintenance mode active
          </span>
        )}
      </div>

      <h2 className={`${shared['admin__section-title']} ${shared['admin__section-title--spaced']}`}>
        Recent Administrative Activity
      </h2>
      {recentAuditRows.length === 0 ? (
        <p className={shared['admin__empty']}>No audit events yet.</p>
      ) : (
        <div className={shared['admin__table-wrap']}>
          <table className={shared['admin__table']}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Actor</th>
                <th>Target</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.action}</td>
                  <td>{row.actorLabel}</td>
                  <td>{row.targetLabel}</td>
                  <td className={shared['admin__text-muted']}>{row.timestampLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </EnterPanel>
  );
};
