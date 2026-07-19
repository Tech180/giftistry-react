import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
import {
  getWishlistImportAccept,
  type WishlistImportExtension,
} from 'features/items/constants/wishlist-import.constants';
import { useToast } from 'app/providers/toast-context';
import { useAuth } from 'app/providers/auth-context';
import { useUserSocket } from 'app/providers/user-socket-context';
import type { ImportTimelineStep } from './interfaces/import-timeline-step.interface';
import type { ImportStripHandle } from './interfaces/import-strip-handle.interface';
import type { ImportStripPhase, ImportStripProps } from './interfaces/import-strip-props.interface';
import { ImportStripTemplate } from './import-strip.html';
import styles from './import-strip.module.css';

export type { ImportStripHandle } from './interfaces/import-strip-handle.interface';

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

export const ImportStrip = forwardRef<ImportStripHandle, ImportStripProps>(function ImportStrip(
  { mode, listId, isExpanded, onImported, className },
  ref
) {
  const { showToast } = useToast();
  const { canShowAi } = useAuth();
  const [phase, setPhase] = useState<ImportStripPhase>('idle');
  const [dropzoneError, setDropzoneError] = useState<string | null>(null);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('Reading file…');
  const [fileName, setFileName] = useState<string | null>(null);
  const [pendingRead, setPendingRead] = useState<ReadImportFileResult | null>(null);
  const [previewWarnings, setPreviewWarnings] = useState<string[]>([]);
  const [previewReady, setPreviewReady] = useState(false);
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
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const menuFileInputRef = useRef<HTMLInputElement>(null);
  const { addEventListener, removeEventListener } = useUserSocket();

  const isBusy = phase === 'uploading' || phase === 'creating';
  const canGrabInfo = canShowAi && phase === 'ready' && pendingRead !== null && previewReady;
  const grabInfoActive = phase === 'ready' && grabInfoArmed;
  const canConfirm =
    pendingRead !== null &&
    previewReady &&
    (mode === 'existing-list' || wishlistTitle.trim().length > 0);
  const defaultAccept = getWishlistImportAccept(canShowAi);

  const stopPolling = () => {
    setActiveJobId(null);
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

    const handleJobUpdate = (data: any) => {
      if (data && data.Job && data.Job.Id === activeJobId) {
        applyJobTimeline(data.Job);

        if (
          data.Job.Status === 'failed' ||
          data.Job.Status === 'cancelled' ||
          data.Job.Status === 'completed'
        ) {
          finishTerminal(data.Job);
        } else {
          const nextListId = data.Job.ListId ?? listId ?? null;
          if (nextListId) {
            notifyListReady(nextListId, data.Job);
          }
        }
      }
    };

    addEventListener('job.progress', handleJobUpdate);
    addEventListener('job.completed', handleJobUpdate);
    addEventListener('job.failed', handleJobUpdate);

    let isCleanup = false;
    jobsApi.getJob(activeJobId).then((latest) => {
      if (isCleanup) return;
      applyJobTimeline(latest);
      if (
        latest.Status === 'failed' ||
        latest.Status === 'cancelled' ||
        latest.Status === 'completed'
      ) {
        finishTerminal(latest);
      } else {
        const nextListId = latest.ListId ?? listId ?? null;
        if (nextListId) {
          notifyListReady(nextListId, latest);
        }
      }
    }).catch(() => {});

    return () => {
      isCleanup = true;
      removeEventListener('job.progress', handleJobUpdate);
      removeEventListener('job.completed', handleJobUpdate);
      removeEventListener('job.failed', handleJobUpdate);
    };
  }, [activeJobId, listId, onImported, showToast, addEventListener, removeEventListener]);

  const resetState = () => {
    stopPolling();
    handedOffRef.current = false;
    setPhase('idle');
    setDropzoneError(null);
    setUploadPercent(0);
    setUploadLabel('Reading file…');
    setFileName(null);
    setPendingRead(null);
    setPreviewWarnings([]);
    setPreviewReady(false);
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
    setPreviewWarnings([]);
    setPreviewReady(false);
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
        allowAi: canShowAi,
        onProgress: (percent) => {
          setUploadPercent(percent);
        },
      });
      setUploadPercent(100);
      setUploadLabel('Parsing preview…');
      setPendingRead(read);

      const preview = await jobsApi.previewWishlistImport({
        listId: mode === 'existing-list' ? listId : null,
        fileName: read.fileName,
        format: read.format,
        content: read.content,
        contentEncoding: read.contentEncoding,
        allowAi: canShowAi,
      });

      const itemCount = preview.Items?.length ?? 0;
      const parseMode = preview.ParseMode || 'unknown';
      const summary = `Parsed ${itemCount} item${itemCount === 1 ? '' : 's'} (${parseMode})`;
      const serverWarnings = Array.isArray(preview.Warnings) ? preview.Warnings : [];
      setPreviewWarnings([summary, ...serverWarnings]);
      setPreviewReady(true);
      if (mode === 'create-list' && preview.SuggestedWishlistTitle?.trim()) {
        setWishlistTitle(preview.SuggestedWishlistTitle.trim());
      }
      setUploadLabel('Upload complete');
      setPhase('ready');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to read file';
      setDropzoneError(message);
      setErrorMessage(message);
      setPendingRead(null);
      setPreviewWarnings([]);
      setPreviewReady(false);
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
        grabInfo: grabInfoArmed && canShowAi,
        allowAi: canShowAi,
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

      setActiveJobId(job.Id);
    } catch (err) {
      setActiveJobId(null);
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

  useImperativeHandle(
    ref,
    () => ({
      browse(extension?: WishlistImportExtension) {
        const input = menuFileInputRef.current;
        if (!input || isBusy) return;
        input.accept = extension ? `.${extension}` : defaultAccept;
        input.click();
      },
      acceptFile(file: File) {
        if (isBusy || !file) return;
        void handleFileSelected(file);
      },
    }),
    [isBusy, defaultAccept, handleFileSelected]
  );

  return (
    <>
      <input
        ref={menuFileInputRef}
        className={styles.hiddenInput}
        type="file"
        accept={defaultAccept}
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          event.target.accept = defaultAccept;
          if (file) {
            void handleFileSelected(file);
          }
        }}
      />
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
        warnings={previewWarnings}
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
        allowAi={canShowAi}
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
    </>
  );
});
