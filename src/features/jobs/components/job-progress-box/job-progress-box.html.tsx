import React from 'react';
import { Button } from 'shared/ui';
import { JobImportTimeline } from '../job-import-timeline/job-import-timeline.html';
import { mapJobToTimeline } from '../../utils/map-job-to-timeline.util';
import { formatImportJobSummary } from '../../utils/format-import-job-summary.util';
import type { JobProgressBoxProps } from './interfaces/job-progress-box-props.interface';
import styles from './job-progress-box.module.css';

function progressPercent(done: number, total: number): number {
  if (total <= 0) return done > 0 ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

export const JobProgressBox: React.FC<JobProgressBoxProps> = ({
  job,
  onCancel,
  isCancelling = false,
}) => {
  const mode = job.Mode === 'existing-list' ? 'existing-list' : 'create-list';
  const timeline = mapJobToTimeline(job, { mode, grabInfoArmed: !!job.GrabInfo });
  const percent =
    timeline.percent || progressPercent(job.ProgressDone, job.ProgressTotal);
  const isActive = job.Status === 'queued' || job.Status === 'running';
  const isTerminal =
    job.Status === 'completed' ||
    job.Status === 'failed' ||
    job.Status === 'cancelled';
  const summary = isTerminal ? formatImportJobSummary(job) : null;
  const isGrabPhase =
    job.Phase === 'grabbing_info' ||
    ((job.Phase === 'suspended' || job.Status === 'suspended') && !!job.GrabInfo);

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
      <div
        className={styles.track}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-label="Job progress"
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
      <div className={styles.meta}>
        <span>
          {isGrabPhase
            ? `${percent}%`
            : `${job.ProgressDone}/${job.ProgressTotal || '—'} · ${percent}%`}
        </span>
      </div>
      <JobImportTimeline
        steps={timeline.steps}
        streams={timeline.streams}
        streamsCaption={timeline.streamsCaption}
      />
      {job.Error && (!summary || summary.message !== job.Error) ? (
        <p className={styles.error}>{job.Error}</p>
      ) : null}
    </section>
  );
};
