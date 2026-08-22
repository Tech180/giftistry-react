import React from 'react';
import { Plus, Wand2, Pencil, X, Info, AlertTriangle, LoaderCircle } from 'lucide-react';
import { AddItemWidgetTemplateProps } from './interfaces/add-item-widget-template-props.interface';
import styles from './add-item-widget.module.css';

const IDLE_HINT = "We'll fetch product details in the background and add the item magically.";
const BUSY_HINT = 'Fetching details and generating item magic...';

export const AddItemWidgetTemplate: React.FC<AddItemWidgetTemplateProps> = ({
  isInputMode,
  isMenuOpen,
  canAutoAdd,
  url,
  setUrl,
  errorMsg,
  isSubmitting,
  urlInputRef,
  widgetRef,
  onToggleMenu,
  onEnterInputMode,
  onExitInputMode,
  onManual,
  handleSubmit,
}) => (
  <div
    ref={widgetRef}
    className={styles.widget}
    data-add-item-widget
    data-input-mode={isInputMode ? 'true' : 'false'}
    data-auto-add={canAutoAdd ? 'true' : 'false'}
    data-menu-open={isMenuOpen ? 'true' : 'false'}
    tabIndex={isInputMode ? -1 : 0}
    aria-label="Add item options"
  >
    <div className={styles['drawer-bar']}>
      <div className={styles['drawer-menu-layer']} aria-hidden={isInputMode}>
        <button
          type="button"
          className={styles['icon-trigger']}
          aria-label={isMenuOpen ? 'Close add options' : 'Open add options'}
          aria-expanded={isMenuOpen}
          aria-haspopup="true"
          onClick={(event) => {
            event.stopPropagation();
            onToggleMenu();
          }}
        >
          <Plus size={18} aria-hidden="true" />
        </button>
        <div className={styles['drawer-actions']}>
          {canAutoAdd ? (
            <button
              type="button"
              className={styles['drawer-action-btn']}
              aria-label="Auto"
              tabIndex={isMenuOpen || !isInputMode ? 0 : -1}
              onClick={(event) => {
                event.stopPropagation();
                onEnterInputMode();
              }}
            >
              <Wand2 size={14} aria-hidden="true" />
              <span className={styles['drawer-action-text']}>Auto</span>
            </button>
          ) : null}
          <button
            type="button"
            className={styles['drawer-action-btn']}
            aria-label="Manual"
            tabIndex={isMenuOpen || !isInputMode ? 0 : -1}
            onClick={(event) => {
              event.stopPropagation();
              onManual();
            }}
          >
            <Pencil size={14} aria-hidden="true" />
            <span className={styles['drawer-action-text']}>Manual</span>
          </button>
        </div>
      </div>

      {canAutoAdd ? (
        <form
          className={styles['drawer-form-layer']}
          onSubmit={handleSubmit}
          aria-label="Auto add item from link"
          noValidate
        >
          <input
            ref={urlInputRef}
            type="url"
            className={styles['url-input']}
            placeholder="Paste product URL..."
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            disabled={isSubmitting}
            autoComplete="off"
          />
          <button
            type="submit"
            className={`${styles['form-btn']} ${styles['submit-btn']}`}
            disabled={isSubmitting || !url.trim()}
            title="Auto-add from link"
            aria-label="Auto-add from link"
          >
            {isSubmitting ? (
              <LoaderCircle size={14} className={styles['spin-icon']} aria-hidden="true" />
            ) : (
              <Wand2 size={14} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className={`${styles['form-btn']} ${styles['cancel-btn']}`}
            onClick={onExitInputMode}
            disabled={isSubmitting}
            title="Close auto add"
            aria-label="Close auto add"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </form>
      ) : null}
    </div>

    <div className={styles['drawer-popover']} aria-live="polite">
      {errorMsg ? (
        <p className={`${styles['popover-text']} ${styles['error-text']}`} role="alert">
          <AlertTriangle size={14} className={styles['popover-icon']} aria-hidden="true" />
          <span>{errorMsg}</span>
        </p>
      ) : (
        <p className={styles['popover-text']}>
          <Info size={14} className={styles['popover-icon']} aria-hidden="true" />
          <span>{isSubmitting ? BUSY_HINT : IDLE_HINT}</span>
        </p>
      )}
    </div>
  </div>
);
