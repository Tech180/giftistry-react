import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { NumberSelectorTemplateProps } from './interfaces/number-selector-template-props.interface';
import styles from './number-selector.module.css';

export const NumberSelectorTemplate: React.FC<NumberSelectorTemplateProps> = ({
  value,
  displayValue,
  disabled,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  size,
  className,
  editable,
  isEditing,
  draft,
  onStartEdit,
  onDraftChange,
  onCommitEdit,
  onCancelEdit,
  editLabel,
}) => {
  const rootClass = [
    styles['number-selector'],
    size === 'sm' ? styles['number-selector-sm'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass} role="group" aria-disabled={disabled || undefined}>
      <button
        type="button"
        className={styles.btn}
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label={decreaseLabel}
      >
        <Minus className={styles.icon} aria-hidden="true" />
      </button>
      {isEditing ? (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className={styles['val-input']}
          value={draft}
          aria-label={editLabel}
          autoFocus
          onChange={(event) => onDraftChange(event.target.value)}
          onBlur={onCommitEdit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onCommitEdit();
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              onCancelEdit();
            }
          }}
        />
      ) : editable && !disabled ? (
        <button
          type="button"
          className={styles['val-btn']}
          onClick={onStartEdit}
          aria-label={editLabel}
          title={editLabel}
        >
          <span className={styles.val} aria-live="polite">
            {displayValue}
          </span>
        </button>
      ) : (
        <span className={styles.val} aria-live="polite" aria-valuenow={value}>
          {displayValue}
        </span>
      )}
      <button
        type="button"
        className={styles.btn}
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label={increaseLabel}
      >
        <Plus className={styles.icon} aria-hidden="true" />
      </button>
    </div>
  );
};
