import React from 'react';
import { ChevronLeft, File } from 'lucide-react';
import { Button } from 'shared/ui';
import { AiPanel } from '../ai-panel/ai-panel.component';
import { Dropzone } from '../dropzone/dropzone.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './menu-panel.module.css';

export const MenuPanelTemplate: React.FC<TemplateProps> = ({
  mode,
  phase,
  isDetails,
  allowAi,
  fileName,
  wishlistTitle,
  setWishlistTitle,
  errorMessage,
  isBusy,
  grabInfoArmed,
  optimizeCategoriesArmed,
  grabSwitchId,
  optimizeSwitchId,
  titleId,
  onClose,
  onBack,
  onFileSelected,
  onConfirm,
  onGrabInfoChange,
  onOptimizeCategoriesChange,
  aiPanelActive,
  confirmDisabled,
  confirmText,
  showReadingHint,
  confirmBusyLabel,
}) => {
  return (
    <div
      className={styles['menu-panel']}
      role="dialog"
      aria-label={isDetails ? 'Import Details' : 'Import'}
    >
      <div
        className={[
          styles['menu-panel__slider'],
          isDetails ? styles['menu-panel__slider--expanded'] : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <section className={styles['menu-panel__view']} aria-hidden={isDetails} inert={isDetails}>
          <div className={styles['menu-panel__header']}>
            <button
              type="button"
              className={styles['menu-panel__chrome-btn']}
              aria-label="Go back"
              tabIndex={isDetails ? -1 : 0}
              onClick={onClose}
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <span>Import</span>
          </div>
          <div
            className={[
              styles['menu-panel__view-content'],
              isDetails ? '' : styles['menu-panel__view-content--active'],
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Dropzone
              variant="menu"
              allowAi={allowAi}
              disabled={isDetails}
              onFileSelected={onFileSelected}
            />
          </div>
        </section>

        <section className={styles['menu-panel__view']} aria-hidden={!isDetails} inert={!isDetails}>
          <div className={styles['menu-panel__header']}>
            <button
              type="button"
              className={styles['menu-panel__chrome-btn']}
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
              styles['menu-panel__view-content'],
              styles['menu-panel__details-content'],
              isDetails ? styles['menu-panel__view-content--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles['menu-panel__file-badge']} title={fileName ?? undefined}>
              <File className={styles['menu-panel__file-badge-icon']} size={16} aria-hidden />
              <span className={styles['menu-panel__file-badge-name']}>{fileName ?? ''}</span>
            </div>

            {mode === 'create-list' ? (
              <div className={styles['menu-panel__title-field']}>
                <label className={styles['menu-panel__title-label']} htmlFor={titleId}>
                  Wishlist title
                </label>
                <input
                  id={titleId}
                  className={styles['menu-panel__title-input']}
                  value={wishlistTitle}
                  onChange={(event) => setWishlistTitle(event.target.value)}
                  placeholder="e.g., Q3 Project Backlog"
                  spellCheck={false}
                  disabled={isBusy}
                />
              </div>
            ) : null}

            {allowAi ? (
              <div className={styles['menu-panel__ai-panel-slot']}>
                <AiPanel
                  active = { aiPanelActive }
                  grabSwitchId = { grabSwitchId }
                  optimizeSwitchId = { optimizeSwitchId }
                  grabArmed = { grabInfoArmed }
                  optimizeArmed = { optimizeCategoriesArmed }
                  canOptimizeCategories = { true }
                  disabled = { isBusy }
                  onGrabChange = { onGrabInfoChange }
                  onOptimizeChange = { onOptimizeCategoriesChange }
                />
              </div>
            ) : null}

            {showReadingHint ? (
              <p className={styles['menu-panel__status-hint']}>{confirmBusyLabel}</p>
            ) : null}
            {errorMessage ? <p className={styles['menu-panel__error']}>{errorMessage}</p> : null}

            <Button
              type="button"
              variant="primary"
              className={styles['menu-panel__confirm']}
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
