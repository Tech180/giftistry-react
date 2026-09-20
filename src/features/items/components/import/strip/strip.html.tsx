import React from 'react';
import { CollapsibleStrip, Button, Badge } from 'shared/ui';
import { Timeline } from 'features/jobs';
import { AiPanel } from '../ai-panel/ai-panel.component';
import { Dropzone } from '../dropzone/dropzone.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './strip.module.css';

export const StripTemplate: React.FC<TemplateProps> = ({
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
  wishlistTitle,
  setWishlistTitle,
  timelineSteps,
  timelineStreams,
  streamsCaption,
  createLabel,
  isBusy,
  canConfirm,
  canGrabInfo,
  grabInfoActive,
  canOptimizeCategories,
  optimizeCategoriesActive,
  allowAi,
  confirmLabel,
  className,
  grabSwitchId,
  optimizeSwitchId,
  pasteId,
  pasteDraft,
  setPasteDraft,
  onFileSelected,
  onPasteText,
  onReset,
  onConfirm,
  onGrabInfoChange,
  onOptimizeCategoriesChange,
  aiPanelActive,
  showDropzone,
  showPaste,
  showProgress,
  showTimeline,
  showActions,
  readyHasError,
  showHeaderMeta,
  dropzoneStatus,
}) => {
  const headerEnd = showHeaderMeta ? (
    <>
      {fileName ? (
        <p className={styles['strip__header-file-name']} title={fileName}>
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
      <div className={styles['strip__body']}>
        {showDropzone ? (
          <Dropzone
            disabled={isBusy}
            status={dropzoneStatus}
            uploadPercent={uploadPercent}
            uploadLabel={uploadLabel}
            error={phase === 'ready' ? errorMessage : dropzoneError}
            allowAi={allowAi}
            onFileSelected={onFileSelected}
          >
            {phase === 'ready' && mode === 'create-list' ? (
              <div className={styles['strip__title-field']}>
                <label className={styles['strip__title-label']} htmlFor="import-strip-wishlist-title">
                  Wishlist title
                </label>
                <input
                  id="import-strip-wishlist-title"
                  className={styles['strip__title-input']}
                  value={wishlistTitle}
                  onChange={(event) => setWishlistTitle(event.target.value)}
                  placeholder="e.g., Q3 Project Backlog"
                  spellCheck={false}
                  disabled={isBusy}
                />
              </div>
            ) : null}
          </Dropzone>
        ) : null}

        {showPaste ? (
          <div className={styles['strip__paste-block']}>
            <label className={styles['strip__paste-label']} htmlFor={pasteId}>
              Or paste JSON, TXT, CSV, or Markdown
            </label>
            <textarea
              id={pasteId}
              className={styles['strip__paste-input']}
              value={pasteDraft}
              onChange={(event) => setPasteDraft(event.target.value)}
              placeholder="# Item name&#10;- Category: Toys&#10;- Link: https://…"
              rows={5}
              disabled={isBusy}
              spellCheck={false}
            />
            <div className={styles['strip__paste-actions']}>
              <Button
                type="button"
                variant="secondary"
                disabled={isBusy || !pasteDraft.trim()}
                onClick={() => {
                  onPasteText(pasteDraft);
                  setPasteDraft('');
                }}
              >
                Use pasted text
              </Button>
            </div>
          </div>
        ) : null}

        {showProgress || showTimeline ? (
          <div className={styles['strip__progress-block']}>
            {showProgress && createLabel ? (
              <p className={styles['strip__progress-label']}>{createLabel}</p>
            ) : null}

            {showTimeline ? (
              <Timeline
                steps={timelineSteps}
                streams={timelineStreams}
                streamsCaption={streamsCaption}
              />
            ) : null}
          </div>
        ) : null}

        {showActions ? (
          <div className={styles['strip__actions']}>
            {canGrabInfo ? (
              <AiPanel
                active = { aiPanelActive }
                grabSwitchId = { grabSwitchId }
                optimizeSwitchId = { optimizeSwitchId }
                grabArmed = { grabInfoActive }
                optimizeArmed = { optimizeCategoriesActive }
                canOptimizeCategories = { canOptimizeCategories }
                disabled = { isBusy }
                onGrabChange = { onGrabInfoChange }
                onOptimizeChange = { onOptimizeCategoriesChange }
              />
            ) : null}
            <div className={styles['strip__actions-end']}>
              <Button type="button" variant="secondary" onClick={onReset} disabled={isBusy}>
                {phase === 'success' ? 'Import another' : 'Cancel'}
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
