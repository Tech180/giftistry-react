import React from 'react';
import { mapJobToTimeline } from '../../utils/map-job-to-timeline.util';
import { formatImportJobSummary } from '../../utils/format-import-job-summary.util';
import { withActiveStepCaptions } from '../../utils/with-active-step-captions.util';
import { useElapsedSeconds } from '../../hooks/use-elapsed-seconds';
import type { Props } from './interfaces/props.interface';
import { ProgressBoxTemplate } from './progress-box.html';
import styles from './progress-box.module.css';

export const ProgressBox: React.FC<Props> = ({
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
  const steps = withActiveStepCaptions(timeline.steps, {
    stepIds: ['found'],
    elapsedSeconds,
  });
  const isActive = job.Status === 'queued' || job.Status === 'running';
  const isTerminal =
    job.Status === 'completed' ||
    job.Status === 'failed' ||
    job.Status === 'cancelled';
  const summary = isTerminal ? formatImportJobSummary(job) : null;
  const title = summary ? summary.title : 'Import in progress';
  const message = summary ? summary.message : timeline.label;
  const error =
    job.Error && (!summary || summary.message !== job.Error) ? job.Error : null;

  return (
    <ProgressBoxTemplate
      title = {
        title
      }
      message = {
        message
      }
      error = {
        error
      }
      isActive = {
        isActive
      }
      isCancelling = {
        isCancelling
      }
      onCancel = {
        onCancel
      }
      steps = {
        steps
      }
      streams = {
        timeline.streams
      }
      streamsCaption = {
        timeline.streamsCaption
      }
      rootClassName = {
        styles.progressBox
      }
      headerClassName = {
        styles.progressBox__header
      }
      titleClassName = {
        styles.progressBox__title
      }
      messageClassName = {
        styles.progressBox__message
      }
      errorClassName = {
        styles.progressBox__error
      }
    />
  );
};
