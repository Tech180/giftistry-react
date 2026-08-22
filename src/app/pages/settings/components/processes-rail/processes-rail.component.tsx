import React, { useId, useState } from 'react';
import { BackgroundProcessesPanel, useBackgroundJobs } from 'features/jobs';
import type { ProcessesRailProps } from './interfaces/processes-rail-props.interface';
import { ProcessesRailTemplate } from './processes-rail.html';
import { prefersCollapsedMobilePanel } from '../../utils/prefers-collapsed-mobile-panel.util';

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
  const panelId = useId();
  const [isCollapsed, setIsCollapsed] = useState(prefersCollapsedMobilePanel);

  return (
    <ProcessesRailTemplate
      panelTitle={panelTitle}
      panelId={panelId}
      isCollapsed={isCollapsed}
      onToggleCollapsed={() => setIsCollapsed((collapsed) => !collapsed)}
    >
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
    </ProcessesRailTemplate>
  );
};
