import type { BackgroundJobView } from '../interfaces/background-job.interface';
import type {
  JobTimelineView,
  TimelineStreamLane,
} from '../interfaces/job-timeline-view.interface';
import type {
  ImportTimelineStep,
  ImportTimelineStepId,
} from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';
import { IMPORT_TIMELINE_STEP_ORDER } from '../constants/job.constants';
import { formatProgressRate } from './format-progress-rate.util';
import {
  formatStreamLaneCaption,
  formatStreamLaneDetail,
} from './format-stream-lane-caption.util';

type ImportMode = 'create-list' | 'existing-list';

function progressPercent(done: number, total: number): number {
  if (total <= 0) return done > 0 ? 100 : 0;
  return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

function baseSteps(mode: ImportMode, includeGrab: boolean): ImportTimelineStep[] {
  const steps: ImportTimelineStep[] = [
    { id: 'upload', label: 'Upload', tone: 'pending' },
    { id: 'found', label: 'Found items', tone: 'pending' },
    {
      id: 'created',
      label: mode === 'create-list' ? 'Created wishlist' : 'Prepared wishlist',
      tone: 'pending',
    },
    { id: 'finalized', label: 'Finalized item selection', tone: 'pending' },
  ];
  if (includeGrab) {
    steps.push(
      { id: 'grabInfo', label: 'Grab info', tone: 'pending' },
      { id: 'savedDetails', label: 'Saved details', tone: 'pending' }
    );
  }
  return steps;
}

function applyTones(
  steps: ImportTimelineStep[],
  activeId: ImportTimelineStepId | null,
  options: { failed?: boolean; complete?: boolean }
): ImportTimelineStep[] {
  const activeIndex = activeId ? IMPORT_TIMELINE_STEP_ORDER.indexOf(activeId) : -1;
  return steps.map((step) => {
    const index = IMPORT_TIMELINE_STEP_ORDER.indexOf(step.id);
    if (options.complete) {
      return { ...step, tone: 'done' as const };
    }
    if (options.failed && activeId && step.id === activeId) {
      return { ...step, tone: 'error' as const };
    }
    if (activeIndex >= 0) {
      if (index < activeIndex) return { ...step, tone: 'done' as const };
      if (index === activeIndex) return { ...step, tone: 'active' as const };
      return { ...step, tone: 'pending' as const };
    }
    return step;
  });
}

function inferPausedOrFallbackStep(
  job: BackgroundJobView,
  mode: ImportMode
): ImportTimelineStepId {
  const message = (job.Message || '').toLowerCase();
  const grabArmed = !!job.GrabInfo;
  const hasGrabProgress =
    grabArmed &&
    (job.ProgressTotal > 0 ||
      message.includes('grab') ||
      (job.ActiveStreams?.length ?? 0) > 0);

  if (hasGrabProgress) return 'grabInfo';
  if (message.includes('add') || job.Phase === 'adding_items') return 'finalized';
  if (
    message.includes('wishlist') ||
    message.includes('creat') ||
    job.Phase === 'creating_list'
  ) {
    return 'created';
  }
  if (
    message.includes('find') ||
    message.includes('parse') ||
    message.includes('no items') ||
    job.Phase === 'queued' ||
    job.Phase === 'parsing'
  ) {
    return 'found';
  }
  if (job.ListId) {
    return mode === 'existing-list' ? 'finalized' : 'finalized';
  }
  return 'found';
}

function phaseToActiveStep(
  phase: BackgroundJobView['Phase'],
  mode: ImportMode,
  job?: BackgroundJobView
): ImportTimelineStepId {
  switch (phase) {
    case 'queued':
    case 'parsing':
      return 'found';
    case 'creating_list':
      return 'created';
    case 'adding_items':
      return 'finalized';
    case 'grabbing_info':
      return 'grabInfo';
    case 'completed':
      return 'savedDetails';
    case 'suspended':
      return job ? inferPausedOrFallbackStep(job, mode) : 'found';
    case 'failed':
    case 'cancelled':
      return job ? inferPausedOrFallbackStep(job, mode) : 'found';
    default:
      return job ? inferPausedOrFallbackStep(job, mode) : 'found';
  }
}

function failedActiveStep(job: BackgroundJobView, mode: ImportMode): ImportTimelineStepId {
  if (job.Phase === 'failed' || job.Phase === 'cancelled') {
    return inferPausedOrFallbackStep(job, mode);
  }
  return phaseToActiveStep(job.Phase, mode, job);
}

export function mapJobToTimeline(
  job: BackgroundJobView | null | undefined,
  options: {
    mode: ImportMode;
    grabInfoArmed?: boolean;
    seedUploadDone?: boolean;
  }
): JobTimelineView {
  const mode = options.mode;
  const includeGrab = !!(job?.GrabInfo ?? options.grabInfoArmed);

  if (!job) {
    const steps = applyTones(baseSteps(mode, includeGrab), 'found', {});
    const seeded = options.seedUploadDone
      ? steps.map((step) =>
          step.id === 'upload' ? { ...step, tone: 'done' as const } : step
        )
      : steps;
    // upload done, found active when seeding from strip confirm
    const withFound = seeded.map((step) => {
      if (step.id === 'upload') return { ...step, tone: 'done' as const };
      if (step.id === 'found') return { ...step, tone: 'active' as const };
      return { ...step, tone: 'pending' as const };
    });
    return {
      steps: options.seedUploadDone ? withFound : seeded,
      streams: [],
      streamsCaption: null,
      percent: options.seedUploadDone ? 8 : 0,
      label: options.seedUploadDone ? 'Starting import…' : 'Waiting…',
    };
  }

  const isTerminalFail = job.Status === 'failed' || job.Status === 'cancelled';
  const isComplete = job.Status === 'completed' || job.Phase === 'completed';
  const isSuspended = job.Status === 'suspended' || job.Phase === 'suspended';
  const activeId = isComplete
    ? null
    : isTerminalFail
      ? failedActiveStep(job, mode)
      : isSuspended
        ? inferPausedOrFallbackStep(job, mode)
        : phaseToActiveStep(job.Phase, mode, job);

  const showGrabSteps =
    includeGrab ||
    job.Phase === 'grabbing_info' ||
    (isSuspended && !!job.GrabInfo) ||
    activeId === 'grabInfo' ||
    activeId === 'savedDetails';

  let steps = applyTones(baseSteps(mode, showGrabSteps), activeId, {
    failed: isTerminalFail,
    complete: isComplete && includeGrab,
  });

  // Upload always done once a job exists.
  steps = steps.map((step) =>
    step.id === 'upload' ? { ...step, tone: 'done' as const } : step
  );

  // Existing-list: once past creating, mark created done as prepared.
  if (mode === 'existing-list' && job.Phase !== 'queued' && job.Phase !== 'parsing') {
    steps = steps.map((step) =>
      step.id === 'created' && step.tone === 'pending'
        ? { ...step, tone: 'done' as const, label: 'Prepared wishlist' }
        : step.id === 'created'
          ? { ...step, label: 'Prepared wishlist' }
          : step
    );
  }

  if (isComplete && !includeGrab) {
    steps = steps.map((step) => ({ ...step, tone: 'done' as const }));
  }

  if (job.Phase === 'parsing' || job.Phase === 'queued') {
    const baseLabel = job.Message?.trim() ? job.Message : 'Finding items…';
    const rateMetric = formatProgressRate(job.ProgressRate) || null;
    steps = steps.map((step) =>
      step.id === 'found'
        ? {
            ...step,
            label: baseLabel,
            metric: rateMetric,
          }
        : step
    );
  }

  if (job.Phase === 'adding_items') {
    const done = job.ProgressDone;
    const total = job.ProgressTotal;
    steps = steps.map((step) =>
      step.id === 'finalized'
        ? {
            ...step,
            label: total > 0 ? 'Adding items' : 'Finalized item selection',
            metric: total > 0 ? `${done}/${total}` : null,
          }
        : step
    );
  }

  if (job.Phase === 'grabbing_info' || (isSuspended && activeId === 'grabInfo')) {
    const summary = job.ItemsSummary;
    const eligible = summary
      ? summary.Pending + summary.Running + summary.Done + summary.Failed
      : job.ProgressTotal;
    const finished = summary
      ? summary.Done + summary.Failed
      : job.ProgressDone;
    const grabRate =
      job.ProgressRate?.Unit === 'items/s' ? job.ProgressRate : null;
    const countPart = eligible > 0 ? `${finished}/${eligible}` : '';
    const ratePart = formatProgressRate(grabRate);
    const metricParts = [countPart, ratePart].filter(Boolean);
    steps = steps.map((step) =>
      step.id === 'grabInfo'
        ? {
            ...step,
            label: 'Grab info',
            metric: metricParts.length > 0 ? metricParts.join(' · ') : null,
          }
        : step
    );
  }

  const streams: TimelineStreamLane[] = (job.ActiveStreams ?? []).map((stream) => {
    const detail = formatStreamLaneDetail(stream.Detail, stream.ProgressRate);
    return {
      id: stream.Id,
      label: stream.Label,
      tone:
        stream.Status === 'running'
          ? 'active'
          : stream.Status === 'failed'
            ? 'error'
            : 'pending',
      detail: detail || null,
      caption: formatStreamLaneCaption(stream.Label, stream.Detail, stream.ProgressRate),
    };
  });

  const running = job.ItemsSummary?.Running ?? streams.length;
  const activeCount = Math.max(streams.length, running);
  const showStreamCaption =
    (job.Phase === 'grabbing_info' || (isSuspended && activeId === 'grabInfo')) &&
    (streams.length > 0 || running > 0);
  const caption = showStreamCaption
    ? `Streams ${activeCount}/${Math.max(activeCount, 1)}`
    : null;

  return {
    steps,
    streams,
    streamsCaption: caption,
    percent: isComplete ? 100 : progressPercent(job.ProgressDone, job.ProgressTotal),
    label: job.Message || (isComplete ? 'Import finished' : 'Working…'),
  };
}

export function buildSeedTimeline(
  mode: ImportMode,
  grabInfoArmed: boolean
): JobTimelineView {
  return mapJobToTimeline(null, {
    mode,
    grabInfoArmed,
    seedUploadDone: true,
  });
}
