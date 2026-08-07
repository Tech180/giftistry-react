import React from 'react';
import { Button } from 'shared/ui';
import { Timeline } from '../timeline/timeline.component';
import { mapJobToTimeline } from '../../utils/map-job-to-timeline.util';
import { formatImportJobSummary } from '../../utils/format-import-job-summary.util';
import { withFoundStepElapsed } from '../../utils/with-found-step-elapsed.util';
import { useElapsedSeconds } from '../../hooks/use-elapsed-seconds';
import type { JobProgressBoxProps } from './interfaces/job-progress-box-props.interface';
import styles from './job-progress-box.module.css';

export const JobProgressBox: React.FC<JobProgressBoxProps> = ({
  job,
  onCancel,
  isCancelling = false,
}) => {
  const mode = job.Mode === 'existing-list' ? 'existing-list' : 'create-list';
  const timeline = mapJobToTimeline(job, { mode, grabInfoArmed: !!job.GrabInfo });
  const foundActive = timeline.steps.some(
    (step) => step.id === 'found' && step.tone === 'active'
  );
  const isParsing =
    (job.Phase === 'parsing' || job.Phase === 'queued') &&
    (job.Status === 'queued' || job.Status === 'running');
  const startedAtMs = job.StartedAt ? Date.parse(job.StartedAt) : null;
  const elapsedSeconds = useElapsedSeconds(
    isParsing && foundActive,
    Number.isFinite(startedAtMs) ? startedAtMs : null
  );
  const steps = withFoundStepElapsed(timeline.steps, elapsedSeconds);
  const isActive = job.Status === 'queued' || job.Status === 'running';
  const isTerminal =
    job.Status === 'completed' ||
    job.Status === 'failed' ||
    job.Status === 'cancelled';
  const summary = isTerminal ? formatImportJobSummary(job) : null;

  return (
    <section className={styles.box} aria-label="Import progress">
      <div className={styles.header}>
        <h3 className={styles.title}>
          {summary ? summary.title : 'Import in progress'}
        </h3>
        {isActive ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isCancelling}
          >
            Cancel
          </Button>
        ) : null}
      </div>
      <p className={styles.message}>{summary ? summary.message : timeline.label}</p>
      <Timeline
        steps={steps}
        streams={timeline.streams}
        streamsCaption={timeline.streamsCaption}
      />
      {job.Error && (!summary || summary.message !== job.Error) ? (
        <p className={styles.error}>{job.Error}</p>
      ) : null}
    </section>
  );
};
