import React from 'react';
import { Sidebar } from 'shared/ui';
import { BackgroundProcessesPanel, useBackgroundJobs } from 'features/jobs';
import type { ProcessesRailProps } from './interfaces/processes-rail-props.interface';
import styles from './processes-rail.module.css';

export const ProcessesRail: React.FC<ProcessesRailProps> = ({
  scope,
  title,
  onError,
}) => {
  const { jobs, error, isLoading, cancel, suspend, resume } = useBackgroundJobs(scope);
  const variant = scope === 'admin' ? 'admin' : 'user';
  const panelTitle =
    title ??
    (scope === 'admin' ? 'Background processes (instance)' : 'Background processes');

  return (
    <aside className={styles.wrapper} aria-label={panelTitle}>
      <Sidebar className={styles.sidebar}>
        <BackgroundProcessesPanel
          jobs={jobs}
          variant={variant}
          title={panelTitle}
          isLoading={isLoading}
          error={error}
          onCancel={(jobId) => {
            void cancel(jobId).catch((err) =>
              onError(err instanceof Error ? err.message : 'Failed to cancel job')
            );
          }}
          onSuspend={(jobId) => {
            void suspend(jobId).catch((err) =>
              onError(err instanceof Error ? err.message : 'Failed to suspend job')
            );
          }}
          onResume={(jobId) => {
            void resume(jobId).catch((err) =>
              onError(err instanceof Error ? err.message : 'Failed to resume job')
            );
          }}
        />
      </Sidebar>
    </aside>
  );
};
