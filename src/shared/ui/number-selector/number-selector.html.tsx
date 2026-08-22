import React from 'react';
import { Minus, Plus } from 'lucide-react';
import type { NumberSelectorTemplateProps } from './interfaces/number-selector-template-props.interface';
import styles from './number-selector.module.css';

export const NumberSelectorTemplate: React.FC<NumberSelectorTemplateProps> = ({
  value,
  disabled,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
  decreaseLabel,
  increaseLabel,
  size,
  className,
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
      <span className={styles.val} aria-live="polite">
        {value}
      </span>
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
