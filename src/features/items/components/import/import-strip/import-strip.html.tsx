import React, { useId } from 'react';
import { CollapsibleStrip, Button, Badge } from 'shared/ui';
import { AiSparklesIcon } from 'shared/ui/badge/icons/ai-badge-icons';
import { JobImportTimeline } from 'features/jobs';
import { ImportDropzone } from '../import-dropzone/import-dropzone.component';
import type { ImportStripTemplateProps } from './interfaces/import-strip-template-props.interface';
import styles from './import-strip.module.css';

export const ImportStripTemplate: React.FC<ImportStripTemplateProps> = ({
  mode,
  phase,
  isExpanded,
  stripStatus,
  title,
  dropzoneError,
  errorMessage,
  uploadPercent,
  uploadLabel,
  fileName,
  warnings,
  wishlistTitle,
  setWishlistTitle,
  timelineSteps,
  timelineStreams,
  streamsCaption,
  createPercent,
  createLabel,
  isBusy,
  canConfirm,
  canGrabInfo,
  grabInfoActive,
  allowAi,
  confirmLabel,
  className,
  onFileSelected,
  onReset,
  onConfirm,
  onGrabInfo,
}) => {
  const grabGradientId = `grab-info-badge-gradient-${useId().replace(/:/g, '')}`;
  const showDropzone =
    phase === 'idle' || phase === 'uploading' || phase === 'ready' || phase === 'error';
  const showProgress = phase === 'creating' || phase === 'success' || phase === 'enriching';
  const showTimeline = timelineSteps.length > 0;
  const showActions =
    phase === 'ready' ||
    phase === 'success' ||
    (phase === 'error' && Boolean(fileName));
  const readyHasError = Boolean(errorMessage);
  const showHeaderMeta =
    Boolean(fileName) &&
    (phase === 'ready' ||
      phase === 'creating' ||
      phase === 'success' ||
      phase === 'enriching' ||
      phase === 'error');

  const dropzoneStatus =
    phase === 'uploading'
      ? 'uploading'
      : phase === 'ready'
        ? errorMessage
          ? 'error'
          : 'ready'
        : phase === 'error' && fileName
          ? 'error'
          : 'idle';

  const headerEnd = showHeaderMeta ? (
    <>
      {fileName ? (
        <p className={styles.headerFileName} title={fileName}>
          {fileName}
        </p>
      ) : null}
      {(phase === 'ready' || (phase === 'error' && fileName)) && (
        <Badge size="sm" active={!readyHasError} ariaLabel={readyHasError ? 'Error' : 'Ready'}>
          {readyHasError ? 'Error' : 'Ready'}
        </Badge>
      )}
    </>
  ) : null;

  return (
    <CollapsibleStrip
      title={title}
      isExpanded={isExpanded}
      status={stripStatus}
      headerEnd={headerEnd}
      className={className}
    >
      <div className={styles.stripBody}>
        {showDropzone ? (
          <ImportDropzone
            disabled={isBusy}
            status={dropzoneStatus}
            uploadPercent={uploadPercent}
            uploadLabel={uploadLabel}
            fileName={fileName}
            error={phase === 'ready' ? errorMessage : dropzoneError}
            allowAi={allowAi}
            onFileSelected={onFileSelected}
          >
            {phase === 'ready' && mode === 'create-list' ? (
              <div className={styles.titleField}>
                <label className={styles.titleLabel} htmlFor="import-strip-wishlist-title">
                  Wishlist title
                </label>
                <input
                  id="import-strip-wishlist-title"
                  className={styles.titleInput}
                  value={wishlistTitle}
                  onChange={(event) => setWishlistTitle(event.target.value)}
                  placeholder="Wishlist title"
                  disabled={isBusy}
                />
              </div>
            ) : null}
          </ImportDropzone>
        ) : null}

        {showProgress || showTimeline ? (
          <div className={styles.progressBlock}>
            {showProgress ? (
              <>
                <div
                  className={styles.progressTrack}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={createPercent}
                  aria-label="Import progress"
                >
                  <div
                    className={styles.progressFill}
                    style={{ width: `${Math.max(0, Math.min(100, createPercent))}%` }}
                  />
                </div>
                <div className={styles.progressStatus}>
                  <p className={styles.progressLabel}>{createLabel}</p>
                  <p className={styles.percent}>{createPercent}%</p>
                </div>
              </>
            ) : null}

            {showTimeline ? (
              <JobImportTimeline
                steps={timelineSteps}
                streams={timelineStreams}
                streamsCaption={streamsCaption}
              />
            ) : null}
          </div>
        ) : null}

        {warnings.length > 0 ? (
          <ul className={styles.warnings}>
            {warnings.map((warning) => (
              <li className={styles.warningItem} key={warning}>
                {warning}
              </li>
            ))}
          </ul>
        ) : null}

        {showActions ? (
          <div className={styles.actions}>
            <div className={styles.actionsLeft}>
              {canGrabInfo ? (
                <Badge
                  effect="rainbow"
                  active={grabInfoActive}
                  size="md"
                  gradientId={grabGradientId}
                  icon={<AiSparklesIcon gradientId={grabGradientId} />}
                  ariaLabel="Grab info"
                  ariaPressed={grabInfoActive}
                  onClick={onGrabInfo}
                >
                  Grab info
                </Badge>
              ) : null}
            </div>
            <div className={styles.actionsRight}>
              <Button type="button" variant="secondary" onClick={onReset} disabled={isBusy}>
                {phase === 'success' ? 'Import another' : 'Choose different file'}
              </Button>
              {phase === 'ready' ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={onConfirm}
                  disabled={!canConfirm || isBusy}
                >
                  {confirmLabel}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </CollapsibleStrip>
  );
};
