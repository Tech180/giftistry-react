import React, { useId } from 'react';
import { ChevronLeft, File, X } from 'lucide-react';
import { Button, Switch } from 'shared/ui';
import { ImportDropzone } from '../import-dropzone/import-dropzone.component';
import type { ImportMenuPanelTemplateProps } from './interfaces/import-menu-panel-template-props.interface';
import styles from './import-menu-panel.module.css';

export const ImportMenuPanelTemplate: React.FC<ImportMenuPanelTemplateProps> = ({
  mode,
  phase,
  isDetails,
  allowAi,
  fileName,
  wishlistTitle,
  setWishlistTitle,
  errorMessage,
  isBusy,
  canConfirm,
  grabInfoArmed,
  optimizeCategoriesArmed,
  confirmLabel,
  confirmBusyLabel,
  onClose,
  onBack,
  onFileSelected,
  onConfirm,
  onGrabInfoChange,
  onOptimizeCategoriesChange,
}) => {
  const grabSwitchId = `import-menu-grab-info-${useId().replace(/:/g, '')}`;
  const optimizeSwitchId = `import-menu-optimize-categories-${useId().replace(/:/g, '')}`;
  const titleId = `import-menu-wishlist-title-${useId().replace(/:/g, '')}`;
  const aiPanelActive = grabInfoArmed || optimizeCategoriesArmed;
  const confirmDisabled = !canConfirm || isBusy;
  const confirmText = phase === 'creating' ? confirmBusyLabel : confirmLabel;
  const showReadingHint = phase === 'uploading';

  return (
    <div
      className={styles.root}
      role="dialog"
      aria-label={isDetails ? 'Import Details' : 'Import'}
    >
      <div className={[styles.slider, isDetails ? styles.sliderExpanded : ''].filter(Boolean).join(' ')}>
        <section className={styles.view} aria-hidden={isDetails} inert={isDetails}>
          <div className={styles.panelHeader}>
            <button
              type="button"
              className={styles.chromeBtn}
              aria-label="Close"
              tabIndex={isDetails ? -1 : 0}
              onClick={onClose}
            >
              <X size={18} aria-hidden />
            </button>
            <span>Import</span>
          </div>
          <div
            className={[styles.viewContent, isDetails ? '' : styles.viewContentActive]
              .filter(Boolean)
              .join(' ')}
          >
            <ImportDropzone
              variant="menu"
              allowAi={allowAi}
              disabled={isDetails}
              onFileSelected={onFileSelected}
            />
          </div>
        </section>

        <section className={styles.view} aria-hidden={!isDetails} inert={!isDetails}>
          <div className={styles.panelHeader}>
            <button
              type="button"
              className={styles.chromeBtn}
              aria-label="Back"
              tabIndex={isDetails ? 0 : -1}
              onClick={onBack}
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <span>Import Details</span>
          </div>
          <div
            className={[
              styles.viewContent,
              styles.detailsContent,
              isDetails ? styles.viewContentActive : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.fileBadge} title={fileName ?? undefined}>
              <File className={styles.fileBadgeIcon} size={16} aria-hidden />
              <span className={styles.fileBadgeName}>{fileName ?? ''}</span>
            </div>

            {mode === 'create-list' ? (
              <div className={styles.titleField}>
                <label className={styles.titleLabel} htmlFor={titleId}>
                  Wishlist title
                </label>
                <input
                  id={titleId}
                  className={styles.titleInput}
                  value={wishlistTitle}
                  onChange={(event) => setWishlistTitle(event.target.value)}
                  placeholder="e.g., Q3 Project Backlog"
                  spellCheck={false}
                  disabled={isBusy}
                />
              </div>
            ) : null}

            {allowAi ? (
              <div
                className={[styles.aiPanel, aiPanelActive ? styles.aiPanelActive : '']
                  .filter(Boolean)
                  .join(' ')}
                role="group"
                aria-label="AI Features"
              >
                <span
                  className={[styles.aiPanelGlow, aiPanelActive ? styles.aiPanelGlowActive : '']
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden
                />
                <div className={styles.aiPanelInner}>
                  <span
                    className={[
                      styles.aiPanelTitle,
                      aiPanelActive ? styles.aiPanelTitleActive : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    AI Processing
                  </span>
                  <div className={styles.aiPanelToggles}>
                    <div className={styles.toggle}>
                      <Switch
                        id={grabSwitchId}
                        size="sm"
                        checked={grabInfoArmed}
                        onChange={onGrabInfoChange}
                        disabled={isBusy}
                        aria-label={
                          grabInfoArmed
                            ? 'Grab info on. Turn off to skip looking up item details.'
                            : 'Grab info off. Turn on to look up missing item details.'
                        }
                      />
                      <label className={styles.toggleLabel} htmlFor={grabSwitchId}>
                        Grab info
                      </label>
                    </div>
                    <div className={styles.toggle}>
                      <Switch
                        id={optimizeSwitchId}
                        size="sm"
                        checked={grabInfoArmed && optimizeCategoriesArmed}
                        onChange={onOptimizeCategoriesChange}
                        disabled={isBusy || !grabInfoArmed}
                        aria-label={
                          !grabInfoArmed
                            ? 'Optimize categories. Enable Grab info first.'
                            : optimizeCategoriesArmed
                              ? 'Optimize categories on. Turn off to keep categories from the file except uncategorized.'
                              : 'Optimize categories off. Categories from the file are kept except uncategorized. Turn on to let AI optimize.'
                        }
                      />
                      <label
                        className={[
                          styles.toggleLabel,
                          !grabInfoArmed ? styles.toggleLabelMuted : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        htmlFor={optimizeSwitchId}
                      >
                        Optimize categories
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {showReadingHint ? (
              <p className={styles.statusHint}>{confirmBusyLabel}</p>
            ) : null}
            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

            <Button
              type="button"
              variant="primary"
              className={styles.confirm}
              onClick={onConfirm}
              disabled={confirmDisabled}
              isLoading={phase === 'creating'}
            >
              {confirmText}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
