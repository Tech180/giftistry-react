import React from 'react';
import { Link } from 'react-router-dom';
import { EnterPanel, Button } from 'shared/ui';
import { AdminOverviewTabTemplateProps } from './interfaces/admin-overview-tab-template-props.interface';
import styles from '../admin.shared.module.css';

export const AdminOverviewTabTemplate: React.FC<AdminOverviewTabTemplateProps> = ({
  isLoading,
  stats,
  recentAudit,
}) => {
  if (isLoading) return <div className={styles.empty}>Loading overview...</div>;

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Overview</h1>
        <p className={styles['page-subtitle']}>Instance health and high-level platform metrics.</p>
      </div>

      {stats && (
        <div className={styles['card-grid']}>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Total users</span>
            <span className={styles['stat-value']}>{stats.Users.Total}</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Active (7d)</span>
            <span className={styles['stat-value']}>{stats.Users.Active7d}</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Disabled</span>
            <span className={styles['stat-value']}>{stats.Users.Disabled}</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Locked</span>
            <span className={styles['stat-value']}>{stats.Users.Locked}</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Wishlists</span>
            <span className={styles['stat-value']}>{stats.Lists.Active}</span>
          </div>
          <div className={styles['stat-card']}>
            <span className={styles['stat-label']}>Open reports</span>
            <span className={styles['stat-value']}>{stats.OpenReports}</span>
          </div>
        </div>
      )}

      <div className={styles['actions-row']}>
        <Link to="/settings/admin/users">
          <Button variant="secondary">Manage users</Button>
        </Link>
        <Link to="/settings/admin/site">
          <Button variant="secondary">Site policy</Button>
        </Link>
        {stats?.MaintenanceMode && (
          <span className={`${styles.badge} ${styles['badge-locked']}`}>Maintenance mode active</span>
        )}
      </div>

      <h2 className={`${styles['section-title']} ${styles['section-title-spaced']}`}>
        Recent Administrative Activity
      </h2>
      {recentAudit.length === 0 ? (
        <p className={styles.empty}>No audit events yet.</p>
      ) : (
        <div className={styles['table-wrap']}>
          <table className={styles['linear-table']}>
            <thead>
              <tr>
                <th>Event</th>
                <th>Actor</th>
                <th>Target</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentAudit.map((entry) => (
                <tr key={entry.Id}>
                  <td>{entry.Action}</td>
                  <td>{entry.ActorUsername ?? '—'}</td>
                  <td>{entry.TargetUsername ?? '—'}</td>
                  <td className={styles['text-muted']}>
                    {entry.CreatedAt ? new Date(entry.CreatedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </EnterPanel>
  );
};
