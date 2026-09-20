import React from 'react';
import { STATUS_BADGE_TONE_CLASS } from './constants/status-badge-tone-class.constant';
import type { Props } from './interfaces/props.interface';
import type { ProcessRow } from './interfaces/template-props.interface';
import { ProcessesPanelTemplate } from './processes-panel.html';
import { buildRowMeta } from './utils/build-row-meta.util';
import { jobTitle } from './utils/job-title.util';
import { progressPercent } from './utils/progress-percent.util';
import styles from './processes-panel.module.css';

export const ProcessesPanel: React.FC<Props> = ({
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
  const rows: ProcessRow[] = jobs.map((job) => {
    const titleText = jobTitle(job);
    const isSuspended = job.Status === 'suspended';
    const statusBadgeClassName = [
      styles.processesPanel__statusBadge,
      STATUS_BADGE_TONE_CLASS[job.Status] ?? '',
    ]
      .filter(Boolean)
      .join(' ');
    const fillClassName = [
      styles.processesPanel__fill,
      isSuspended ? styles['processesPanel__fill--suspended'] ?? '' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return {
      id: job.Id,
      title: titleText,
      meta: buildRowMeta(job, variant),
      message: job.Message || job.Phase,
      status: job.Status,
      percent: progressPercent(job),
      canSuspend: job.Status === 'queued' || job.Status === 'running',
      canResume: isSuspended,
      canCancel:
        job.Status === 'queued' ||
        job.Status === 'running' ||
        job.Status === 'suspended',
      isSuspended,
      progressLabel: `${titleText} progress`,
      statusBadgeClassName,
      fillClassName,
    };
  });

  return (
    <ProcessesPanelTemplate
      title = {
        title
      }
      subtitle = {
        variant === 'admin' ? 'Instance-wide active jobs' : 'Your active imports'
      }
      emptyLabel = {
        emptyLabel
      }
      error = {
        error
      }
      isLoadingEmpty = {
        isLoading && jobs.length === 0
      }
      isEmpty = {
        jobs.length === 0
      }
      rows = {
        rows
      }
      onCancel = {
        onCancel
      }
      onSuspend = {
        onSuspend
      }
      onResume = {
        onResume
      }
      rootClassName = {
        styles.processesPanel
      }
      headerClassName = {
        styles.processesPanel__header
      }
      titleClassName = {
        styles.processesPanel__title
      }
      subtitleClassName = {
        styles.processesPanel__subtitle
      }
      errorClassName = {
        styles.processesPanel__error
      }
      emptyClassName = {
        styles.processesPanel__empty
      }
      listClassName = {
        styles.processesPanel__list
      }
      rowClassName = {
        styles.processesPanel__row
      }
      rowHeaderClassName = {
        styles.processesPanel__rowHeader
      }
      rowTopClassName = {
        styles.processesPanel__rowTop
      }
      rowTitleClassName = {
        styles.processesPanel__rowTitle
      }
      rowMetaClassName = {
        styles.processesPanel__rowMeta
      }
      rowMessageClassName = {
        styles.processesPanel__rowMessage
      }
      trackClassName = {
        styles.processesPanel__track
      }
      actionsClassName = {
        styles.processesPanel__actions
      }
    />
  );
};
