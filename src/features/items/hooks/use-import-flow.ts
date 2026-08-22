import { useEffect, useRef, useState } from 'react';
import type { CollapsibleStripStatus } from 'shared/ui';
import {
  jobsApi,
  buildSeedTimeline,
  mapJobToTimeline,
  formatImportJobSummary,
  claimImportJobTerminalToast,
  isTerminalJobStatus,
  type BackgroundJobView,
} from 'features/jobs';
import type { TimelineStreamLane } from 'features/jobs/interfaces/job-timeline-view.interface';
import { useElapsedSeconds } from 'features/jobs/hooks/use-elapsed-seconds';
import { withActiveStepCaptions } from 'features/jobs/utils/with-active-step-captions.util';
import {
  readImportFile,
  type ReadImportFileResult,
} from 'features/items/utils/read-import-file.util';
import { filenameStemAsTitle } from 'features/items/utils/detect-import-format.util';
import { useToast } from 'app/providers/toast-context';
import { useUserSocket } from 'app/providers/user-socket-context';
import type { ImportTimelineStep } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';
import type { ImportStripPhase } from 'features/items/components/import/import-strip/interfaces/import-strip-props.interface';
import type { UseImportFlowOptions } from './interfaces/use-import-flow-options.interface';
import type { UseImportFlowResult } from './interfaces/use-import-flow-result.interface';

export function useImportFlow({
  mode,
  listId,
  allowAi,
  onImported,
}: UseImportFlowOptions): UseImportFlowResult {
  const { showToast } = useToast();
  const [phase, setPhase] = useState<ImportStripPhase>('idle');
  const [dropzoneError, setDropzoneError] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('Reading file…');
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingRead, setPendingRead] = useState<ReadImportFileResult | null>(null);
  const [wishlistTitle, setWishlistTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createLabel, setCreateLabel] = useState('Starting import…');
  const [grabInfoArmed, setGrabInfoArmed] = useState(() => allowAi);
  const [optimizeCategoriesArmed, setOptimizeCategoriesArmed] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<ImportTimelineStep[]>([]);
  const [timelineStreams, setTimelineStreams] = useState<TimelineStreamLane[]>([]);
  const [streamsCaption, setStreamsCaption] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successTone, setSuccessTone] = useState<CollapsibleStripStatus['tone']>('success');
  const handedOffRef = useRef(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const { addEventListener, removeEventListener } = useUserSocket();

  const isBusy = phase === 'uploading' || phase === 'creating';
  const canGrabInfo = allowAi && phase === 'ready' && pendingRead !== null;
  const grabInfoActive = phase === 'ready' && grabInfoArmed;
  const canOptimizeCategories = canGrabInfo;
  const optimizeCategoriesActive = phase === 'ready' && optimizeCategoriesArmed;
  const canConfirm =
    pendingRead !== null &&
    phase === 'ready' &&
    (mode === 'existing-list' || wishlistTitle.trim().length > 0);
  const confirmLabel = mode === 'create-list' ? 'Create wishlist' : 'Import items';

  const stopImportPolling = () => {
    setActiveJobId(null);
  };

  const applyJobTimeline = (job: BackgroundJobView) => {
    const view = mapJobToTimeline(job, { mode, grabInfoArmed: !!job.GrabInfo });
    setTimelineSteps(view.steps);
    setTimelineStreams(view.streams);
    setStreamsCaption(view.streamsCaption);
    setCreateLabel(view.label);
  };

  useEffect(() => () => stopImportPolling(), []);

  useEffect(() => {
    if (!activeJobId) return;

    const notifyListReady = (targetListId: string, latest: BackgroundJobView) => {
      if (handedOffRef.current) return;
      handedOffRef.current = true;
      onImported({
        listId: targetListId,
        jobId: latest.Id,
        created: 0,
        failed: 0,
      });
    };

    const finishTerminal = (latest: BackgroundJobView) => {
      setActiveJobId(null);
      const summary = formatImportJobSummary(latest);

      if (latest.Status === 'completed') {
        setSuccessMessage(summary.message);
        setSuccessTone('success');
        setCreateLabel(summary.message);
        setPhase('success');
        const targetListId = latest.ListId ?? listId;
        if (targetListId && !handedOffRef.current) {
          notifyListReady(targetListId, latest);
        }
      } else {
        setErrorMessage(summary.message);
        setCreateLabel(summary.message);
        setPhase('ready');
      }

      if (claimImportJobTerminalToast(latest.Id, latest.Status)) {
        showToast(summary.message, summary.tone);
      }
    };

    const handleJobUpdate = (data: { Job?: BackgroundJobView }) => {
      if (data?.Job?.Id !== activeJobId) return;
      applyJobTimeline(data.Job);

      if (isTerminalJobStatus(data.Job.Status)) {
        finishTerminal(data.Job);
      } else {
        const nextListId = data.Job.ListId ?? listId ?? null;
        if (nextListId) {
          notifyListReady(nextListId, data.Job);
        }
      }
    };

    addEventListener('job.progress', handleJobUpdate);
    addEventListener('job.completed', handleJobUpdate);
    addEventListener('job.failed', handleJobUpdate);

    let isCleanup = false;
    jobsApi
      .getJob(activeJobId)
      .then((latest) => {
        if (isCleanup) return;
        applyJobTimeline(latest);
        if (isTerminalJobStatus(latest.Status)) {
          finishTerminal(latest);
        } else {
          const nextListId = latest.ListId ?? listId ?? null;
          if (nextListId) {
            notifyListReady(nextListId, latest);
          }
        }
      })
      .catch(() => {});

    return () => {
      isCleanup = true;
      removeEventListener('job.progress', handleJobUpdate);
      removeEventListener('job.completed', handleJobUpdate);
      removeEventListener('job.failed', handleJobUpdate);
    };
  }, [activeJobId, listId, onImported, showToast, addEventListener, removeEventListener]);

  const resetState = () => {
    stopImportPolling();
    handedOffRef.current = false;
    setPhase('idle');
    setDropzoneError(null);
    setUploadPercent(0);
    setUploadLabel('Reading file…');
    setFileName(null);
    setPendingRead(null);
    setWishlistTitle('');
    setErrorMessage(null);
    setCreateLabel('Starting import…');
    setGrabInfoArmed(allowAi);
    setOptimizeCategoriesArmed(false);
    setTimelineSteps([]);
    setTimelineStreams([]);
    setStreamsCaption(null);
    setSuccessMessage(null);
    setSuccessTone('success');
  };

  const handleFileSelected = async (file: File) => {
    stopImportPolling();
    handedOffRef.current = false;
    setDropzoneError(null);
    setErrorMessage(null);
    setPendingRead(null);
    setGrabInfoArmed(allowAi);
    setOptimizeCategoriesArmed(false);
    setTimelineSteps([]);
    setTimelineStreams([]);
    setStreamsCaption(null);
    setSuccessMessage(null);
    setFileName(file.name);
    setWishlistTitle(filenameStemAsTitle(file.name));
    setUploadPercent(0);
    setUploadLabel('Reading file…');
    setPhase('uploading');

    try {
      const read = await readImportFile(file, {
        allowAi,
        onProgress: (percent) => {
          setUploadPercent(percent);
        },
      });
      setUploadPercent(100);
      setUploadLabel('Upload complete');
      setPendingRead(read);
      setPhase('ready');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      setDropzoneError(message);
      setErrorMessage(message);
      setPendingRead(null);
      setPhase('error');
    }
  };

  const handleConfirm = async () => {
    if (!pendingRead || !canConfirm) {
      setErrorMessage(
        mode === 'create-list'
          ? 'Choose a file and enter a wishlist title before creating.'
          : 'Choose a file before importing.'
      );
      return;
    }

    if (mode === 'existing-list' && !listId) {
      setErrorMessage('Wishlist is required for import.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    handedOffRef.current = false;
    const seeded = buildSeedTimeline(mode, grabInfoArmed);
    setTimelineSteps(seeded.steps);
    setTimelineStreams([]);
    setStreamsCaption(null);
    setCreateLabel(seeded.label);
    setPhase('creating');

    try {
      const job = await jobsApi.startWishlistImport({
        mode,
        listId: mode === 'existing-list' ? listId : null,
        title: mode === 'create-list' ? wishlistTitle.trim() : null,
        fileName: pendingRead.fileName,
        format: pendingRead.format,
        content: pendingRead.content,
        contentEncoding: pendingRead.contentEncoding,
        grabInfo: grabInfoArmed && allowAi,
        allowAi,
        optimizeCategories: optimizeCategoriesArmed && grabInfoArmed && allowAi,
      });

      applyJobTimeline(job);

      const notifyListReady = (targetListId: string, latest: BackgroundJobView) => {
        if (handedOffRef.current) return;
        handedOffRef.current = true;
        onImported({
          listId: targetListId,
          jobId: latest.Id,
          created: 0,
          failed: 0,
        });
      };

      const finishTerminal = (latest: BackgroundJobView) => {
        const summary = formatImportJobSummary(latest);

        if (latest.Status === 'completed') {
          setSuccessMessage(summary.message);
          setSuccessTone('success');
          setCreateLabel(summary.message);
          setPhase('success');
          const targetListId = latest.ListId ?? listId;
          if (targetListId && !handedOffRef.current) {
            notifyListReady(targetListId, latest);
          }
        } else {
          setErrorMessage(summary.message);
          setCreateLabel(summary.message);
          setPhase('ready');
        }

        if (claimImportJobTerminalToast(latest.Id, latest.Status)) {
          showToast(summary.message, summary.tone);
        }
      };

      const targetListId = job.ListId ?? listId ?? null;
      if (targetListId) {
        notifyListReady(targetListId, job);
      }

      if (isTerminalJobStatus(job.Status)) {
        finishTerminal(job);
        return;
      }

      setActiveJobId(job.Id);
    } catch (err) {
      setActiveJobId(null);
      const message = err instanceof Error ? err.message : 'Import failed';
      setErrorMessage(message);
      setCreateLabel('Import failed');
      setPhase('ready');
    }
  };

  const handleGrabInfoChange = (checked: boolean) => {
    if (phase === 'creating' || phase === 'success') return;
    setGrabInfoArmed(checked);
  };

  const handleOptimizeCategoriesChange = (checked: boolean) => {
    if (phase === 'creating' || phase === 'success') return;
    setOptimizeCategoriesArmed(checked);
  };

  const rateStepActive = timelineSteps.some(
    (step) =>
      (step.id === 'found' || step.id === 'grabInfo') && step.tone === 'active'
  );
  const elapsedSeconds = useElapsedSeconds(phase === 'creating' && rateStepActive);
  const displayTimelineSteps = withActiveStepCaptions(timelineSteps, {
    stepIds: ['found', 'grabInfo'],
    elapsedSeconds,
  });

  return {
    mode,
    phase,
    dropzoneError,
    errorMessage,
    uploadPercent,
    uploadLabel,
    fileName,
    wishlistTitle,
    setWishlistTitle,
    timelineSteps: displayTimelineSteps,
    timelineStreams,
    streamsCaption,
    createLabel,
    isBusy,
    canConfirm,
    canGrabInfo,
    grabInfoActive,
    grabInfoArmed,
    canOptimizeCategories,
    optimizeCategoriesActive,
    optimizeCategoriesArmed,
    allowAi,
    confirmLabel,
    successMessage,
    successTone,
    handleFileSelected: (file: File) => {
      void handleFileSelected(file);
    },
    handleConfirm: () => {
      void handleConfirm();
    },
    resetState,
    handleGrabInfoChange,
    handleOptimizeCategoriesChange,
  };
}
