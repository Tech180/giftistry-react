import React from 'react';
import type { NumberSelectorProps } from './interfaces/number-selector-props.interface';
import { NumberSelectorTemplate } from './number-selector.html';

export type { NumberSelectorProps } from './interfaces/number-selector-props.interface';

export const NumberSelector: React.FC<NumberSelectorProps> = ({
  value,
  min = 0,
  max,
  onChange,
  disabled = false,
  decreaseLabel = 'Decrease',
  increaseLabel = 'Increase',
  size = 'md',
  className = '',
}) => {
  const clamped = Math.min(max, Math.max(min, value));
  const atMin = clamped <= min;
  const atMax = clamped >= max;

  const onDecrease = () => {
    if (disabled || atMin) {
      return;
    }
    onChange(Math.max(min, clamped - 1));
  };

  const onIncrease = () => {
    if (disabled || atMax) {
      return;
    }
    onChange(Math.min(max, clamped + 1));
  };

  return (
    <NumberSelectorTemplate
      value={clamped}
      disabled={disabled}
      decreaseDisabled={disabled || atMin}
      increaseDisabled={disabled || atMax}
      onDecrease={onDecrease}
      onIncrease={onIncrease}
      decreaseLabel={decreaseLabel}
      increaseLabel={increaseLabel}
      size={size}
      className={className}
    />
  );
};
