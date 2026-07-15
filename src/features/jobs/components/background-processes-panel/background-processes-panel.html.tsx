import React from 'react';
import { Button } from 'shared/ui';
import type { BackgroundProcessesPanelProps } from './interfaces/background-processes-panel-props.interface';
import type { BackgroundJobView } from '../../interfaces/background-job.interface';
import styles from './background-processes-panel.module.css';

function progressPercent(job: BackgroundJobView): number {
  if (job.ProgressTotal <= 0) return job.Status === 'queued' ? 0 : 5;
  return Math.max(0, Math.min(100, Math.round((job.ProgressDone / job.ProgressTotal) * 100)));
}

function jobTitle(job: BackgroundJobView): string {
  return job.FileName?.trim() || 'Wishlist import';
}

export const BackgroundProcessesPanel: React.FC<BackgroundProcessesPanelProps> = ({
  jobs,
  variant,
  title = 'Background processes',
  emptyLabel = 'No background processes',
  error = null,
  onCancel,
  onSuspend,
  onResume,
  isLoading = false,
}) => {
  return (
    <section className={styles.panel} aria-label={title}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          {variant === 'admin' ? 'Instance-wide active jobs' : 'Your active imports'}
        </p>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {isLoading && jobs.length === 0 ? (
        <p className={styles.empty}>Loading…</p>
      ) : jobs.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <ul className={styles.list}>
          {jobs.map((job) => {
            const percent = progressPercent(job);
            const isSuspended = job.Status === 'suspended';
            const canSuspend = job.Status === 'queued' || job.Status === 'running';
            const canResume = isSuspended;
            const canCancel =
              job.Status === 'queued' ||
              job.Status === 'running' ||
              job.Status === 'suspended';

            return (
              <li key={job.Id} className={styles.row}>
                <div className={styles.rowHeader}>
                  <div className={styles.rowTop}>
                    <p className={styles.rowTitle} title={jobTitle(job)}>
                      {jobTitle(job)}
                    </p>
                    {variant === 'admin' || job.ListId ? (
                      <p className={styles.rowMeta}>
                        {variant === 'admin' && job.UserId
                          ? `${job.UserId.slice(0, 8)}…`
                          : null}
                        {variant === 'admin' && job.UserId && job.ListId ? ' · ' : null}
                        {job.ListId ? `list ${job.ListId.slice(0, 8)}…` : null}
                      </p>
                    ) : null}
                    <p className={styles.rowMessage}>{job.Message || job.Phase}</p>
                  </div>
                  <span className={styles.statusBadge} data-status={job.Status}>
                    {job.Status}
                  </span>
                </div>
                <div
                  className={styles.track}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={`${jobTitle(job)} progress`}
                >
                  <div
                    className={isSuspended ? `${styles.fill} ${styles.fillSuspended}` : styles.fill}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className={styles.actions}>
                  {canSuspend ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onSuspend(job.Id)}
                    >
                      Suspend
                    </Button>
                  ) : null}
                  {canResume ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onResume(job.Id)}
                    >
                      Resume
                    </Button>
                  ) : null}
                  {canCancel ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => onCancel(job.Id)}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
