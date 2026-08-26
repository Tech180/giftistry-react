import React, { useId, useState } from 'react';
import { CollapsibleStrip, Button, Badge, Switch } from 'shared/ui';
import { Timeline } from 'features/jobs';
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
  onFileSelected,
  onPasteText,
  onReset,
  onConfirm,
  onGrabInfoChange,
  onOptimizeCategoriesChange,
}) => {
  const grabSwitchId = `import-grab-info-${useId().replace(/:/g, '')}`;
  const optimizeSwitchId = `import-optimize-categories-${useId().replace(/:/g, '')}`;
  const pasteId = `import-paste-${useId().replace(/:/g, '')}`;
  const [pasteDraft, setPasteDraft] = useState('');
  const aiPanelActive = grabInfoActive || optimizeCategoriesActive;
  const showDropzone =
    phase === 'idle' || phase === 'uploading' || phase === 'ready' || phase === 'error';
  const showPaste = phase === 'idle' || (phase === 'error' && !fileName);
  const showProgress = phase === 'creating' || phase === 'success' || phase === 'enriching';
  const showTimeline = timelineSteps.length > 0;
  const showActions =
    phase === 'ready' || phase === 'success' || (phase === 'error' && Boolean(fileName));
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
                  placeholder="e.g., Q3 Project Backlog"
                  spellCheck={false}
                  disabled={isBusy}
                />
              </div>
            ) : null}
          </ImportDropzone>
        ) : null}

        {showPaste ? (
          <div className={styles.pasteBlock}>
            <label className={styles.pasteLabel} htmlFor={pasteId}>
              Or paste JSON, TXT, CSV, or Markdown
            </label>
            <textarea
              id={pasteId}
              className={styles.pasteInput}
              value={pasteDraft}
              onChange={(event) => setPasteDraft(event.target.value)}
              placeholder="# Item name&#10;- Category: Toys&#10;- Link: https://…"
              rows={5}
              disabled={isBusy}
              spellCheck={false}
            />
            <div className={styles.pasteActions}>
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
          <div className={styles.progressBlock}>
            {showProgress && createLabel ? (
              <p className={styles.progressLabel}>{createLabel}</p>
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
            {canGrabInfo ? (
              <div
                className={[styles.aiPanel, aiPanelActive ? styles.aiPanelActive : '']
                  .filter(Boolean)
                  .join(' ')}
                role="group"
                aria-label="AI Features"
              >
                <span className={styles.aiPanelGlow} aria-hidden />
                <div className={styles.aiPanelInner}>
                  <div className={styles.aiPanelHeader}>
                    <span className={styles.aiPanelTitle}>AI Processing</span>
                  </div>
                  <div className={styles.aiPanelToggles}>
                    <div className={styles.toggle}>
                      <Switch
                        id={grabSwitchId}
                        size="sm"
                        checked={grabInfoActive}
                        onChange={onGrabInfoChange}
                        disabled={isBusy}
                        aria-label={
                          grabInfoActive
                            ? 'Grab info on. Turn off to skip looking up item details.'
                            : 'Grab info off. Turn on to look up missing item details.'
                        }
                      />
                      <label className={styles.toggleLabel} htmlFor={grabSwitchId}>
                        Grab info
                      </label>
                    </div>
                    {canOptimizeCategories ? (
                      <div className={styles.toggle}>
                        <Switch
                          id={optimizeSwitchId}
                          size="sm"
                          checked={grabInfoActive && optimizeCategoriesActive}
                          onChange={onOptimizeCategoriesChange}
                          disabled={isBusy || !grabInfoActive}
                          aria-label={
                            !grabInfoActive
                              ? 'Optimize categories. Enable Grab info first.'
                              : optimizeCategoriesActive
                                ? 'Optimize categories on. Turn off to keep categories from the file except uncategorized.'
                                : 'Optimize categories off. Categories from the file are kept except uncategorized. Turn on to let AI optimize.'
                          }
                        />
                        <label
                          className={[
                            styles.toggleLabel,
                            !grabInfoActive ? styles.toggleLabelMuted : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          htmlFor={optimizeSwitchId}
                        >
                          Optimize categories
                        </label>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
            <div className={styles.actionsEnd}>
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
