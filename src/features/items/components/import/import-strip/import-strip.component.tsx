import React, { useEffect, useRef, useState } from 'react';
import type { CollapsibleStripStatus } from 'shared/ui';
import {
  jobsApi,
  buildSeedTimeline,
  mapJobToTimeline,
  formatImportJobSummary,
  claimImportJobTerminalToast,
  type BackgroundJobView,
} from 'features/jobs';
import type { TimelineStreamLane } from 'features/jobs/utils/map-job-to-timeline.util';
import {
  readImportFile,
  type ReadImportFileResult,
} from 'features/items/utils/read-import-file.util';
import { filenameStemAsTitle } from 'features/items/utils/detect-import-format.util';
import { useToast } from 'app/providers/toast-context';
import type { ImportTimelineStep } from './interfaces/import-timeline-step.interface';
import type { ImportStripPhase, ImportStripProps } from './interfaces/import-strip-props.interface';
import { ImportStripTemplate } from './import-strip.html';

function buildStatus(
  phase: ImportStripPhase,
  options: {
    wishlistTitle: string;
    errorMessage: string | null;
    mode: ImportStripProps['mode'];
    uploadPercent: number;
    successMessage?: string | null;
    successTone?: CollapsibleStripStatus['tone'];
  }
): CollapsibleStripStatus | undefined {
  switch (phase) {
    case 'uploading':
      return {
        tone: 'progress',
        message: `Uploading ${options.uploadPercent}%`,
      };
    case 'ready':
    case 'creating':
      return undefined;
    case 'success':
      return {
        tone: options.successTone ?? 'success',
        message:
          options.successMessage ||
          (options.mode === 'create-list'
            ? `Import finished for “${options.wishlistTitle}”`
            : 'Import finished'),
      };
    case 'error':
      return {
        tone: 'error',
        message: options.errorMessage || 'Import failed',
      };
    default:
      return { tone: 'idle', message: 'Drop a file or browse to import' };
  }
}

export const ImportStrip: React.FC<ImportStripProps> = ({
  mode,
  listId,
  isExpanded,
  onImported,
  className,
}) => {
  const { showToast } = useToast();
  const [phase, setPhase] = useState<ImportStripPhase>('idle');
  const [dropzoneError, setDropzoneError] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('Reading file…');
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingRead, setPendingRead] = useState<ReadImportFileResult | null>(null);
  const [wishlistTitle, setWishlistTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createPercent, setCreatePercent] = useState(0);
  const [createLabel, setCreateLabel] = useState('Starting import…');
  const [grabInfoArmed, setGrabInfoArmed] = useState(false);
  const [timelineSteps, setTimelineSteps] = useState<ImportTimelineStep[]>([]);
  const [timelineStreams, setTimelineStreams] = useState<TimelineStreamLane[]>([]);
  const [streamsCaption, setStreamsCaption] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successTone, setSuccessTone] = useState<CollapsibleStripStatus['tone']>('success');
  const handedOffRef = useRef(false);
  const pollRef = useRef<number | null>(null);

  const isBusy = phase === 'uploading' || phase === 'creating';
  const canGrabInfo = phase === 'ready' && pendingRead !== null;
  const grabInfoActive = phase === 'ready' && grabInfoArmed;
  const canConfirm =
    pendingRead !== null &&
    (mode === 'existing-list' || wishlistTitle.trim().length > 0);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const applyJobTimeline = (job: BackgroundJobView) => {
    const view = mapJobToTimeline(job, { mode, grabInfoArmed: !!job.GrabInfo });
    setTimelineSteps(view.steps);
    setTimelineStreams(view.streams);
    setStreamsCaption(view.streamsCaption);
    setCreatePercent(view.percent);
    setCreateLabel(view.label);
  };

  useEffect(() => () => stopPolling(), []);

  const resetState = () => {
    stopPolling();
    handedOffRef.current = false;
    setPhase('idle');
    setDropzoneError(null);
    setUploadPercent(0);
    setUploadLabel('Reading file…');
    setFileName(null);
    setPendingRead(null);
    setWishlistTitle('');
    setErrorMessage(null);
    setCreatePercent(0);
    setCreateLabel('Starting import…');
    setGrabInfoArmed(false);
    setTimelineSteps([]);
    setTimelineStreams([]);
    setStreamsCaption(null);
    setSuccessMessage(null);
    setSuccessTone('success');
  };

  const handleFileSelected = async (file: File) => {
    stopPolling();
    handedOffRef.current = false;
    setDropzoneError(null);
    setErrorMessage(null);
    setPendingRead(null);
    setGrabInfoArmed(false);
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
    setCreatePercent(seeded.percent);
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
        grabInfo: grabInfoArmed,
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
        stopPolling();
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

      let targetListId = job.ListId ?? listId ?? null;
      if (targetListId) {
        notifyListReady(targetListId, job);
      }

      if (
        job.Status === 'completed' ||
        job.Status === 'failed' ||
        job.Status === 'cancelled'
      ) {
        finishTerminal(job);
        return;
      }

      const pollOnce = async () => {
        try {
          const latest = await jobsApi.getJob(job.Id);
          applyJobTimeline(latest);

          if (
            latest.Status === 'failed' ||
            latest.Status === 'cancelled' ||
            latest.Status === 'completed'
          ) {
            finishTerminal(latest);
            return;
          }

          const nextListId = latest.ListId ?? listId ?? null;
          if (nextListId) {
            notifyListReady(nextListId, latest);
          }
        } catch {
          /* ignore transient poll errors */
        }
      };

      void pollOnce();
      pollRef.current = window.setInterval(() => {
        void pollOnce();
      }, 2000);
    } catch (err) {
      stopPolling();
      const message = err instanceof Error ? err.message : 'Import failed';
      setErrorMessage(message);
      setCreateLabel('Import failed');
      setPhase('ready');
    }
  };

  const handleGrabInfoClick = () => {
    if (phase === 'ready') {
      setGrabInfoArmed((prev) => !prev);
    }
  };

  const stripStatus = buildStatus(phase, {
    wishlistTitle: wishlistTitle.trim() || 'Wishlist',
    errorMessage,
    mode,
    uploadPercent,
    successMessage,
    successTone,
  });

  return (
    <ImportStripTemplate
      mode={mode}
      phase={phase}
      isExpanded={isExpanded}
      stripStatus={stripStatus}
      title={mode === 'create-list' ? 'Import Wishlist' : 'Import Items'}
      dropzoneError={dropzoneError}
      errorMessage={errorMessage}
      uploadPercent={uploadPercent}
      uploadLabel={uploadLabel}
      fileName={fileName}
      warnings={[]}
      wishlistTitle={wishlistTitle}
      setWishlistTitle={setWishlistTitle}
      timelineSteps={timelineSteps}
      timelineStreams={timelineStreams}
      streamsCaption={streamsCaption}
      createPercent={createPercent}
      createLabel={createLabel}
      isBusy={isBusy}
      canConfirm={canConfirm}
      canGrabInfo={canGrabInfo}
      grabInfoActive={grabInfoActive}
      confirmLabel={mode === 'create-list' ? 'Create wishlist' : 'Import items'}
      className={className}
      onFileSelected={(file) => {
        void handleFileSelected(file);
      }}
      onReset={resetState}
      onConfirm={() => {
        void handleConfirm();
      }}
      onGrabInfo={handleGrabInfoClick}
    />
  );
};
