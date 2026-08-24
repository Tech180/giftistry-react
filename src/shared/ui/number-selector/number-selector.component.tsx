import React, { useEffect, useState } from 'react';
import { Infinity } from 'lucide-react';
import type { NumberSelectorProps } from './interfaces/number-selector-props.interface';
import { NumberSelectorTemplate } from './number-selector.html';
import styles from './number-selector.module.css';

export type { NumberSelectorProps } from './interfaces/number-selector-props.interface';

function clampValue(value: number, min: number, max: number | undefined): number {
  const lower = Math.max(min, value);
  return typeof max === 'number' ? Math.min(max, lower) : lower;
}

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
  editable = true,
  zeroAsInfinity = false,
}) => {
  const hasMax = typeof max === 'number';
  const clamped = clampValue(value, min, max);
  const atMin = clamped <= min;
  const atMax = hasMax && clamped >= max;
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(String(clamped));

  useEffect(() => {
    if (!isEditing) {
      setDraft(String(clamped));
    }
  }, [clamped, isEditing]);

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
    onChange(hasMax ? Math.min(max, clamped + 1) : clamped + 1);
  };

  const onStartEdit = () => {
    if (disabled || !editable) {
      return;
    }
    setDraft(String(clamped));
    setIsEditing(true);
  };

  const onCancelEdit = () => {
    setDraft(String(clamped));
    setIsEditing(false);
  };

  const onCommitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed === '') {
      onCancelEdit();
      return;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(parsed)) {
      onCancelEdit();
      return;
    }
    const next = clampValue(parsed, min, max);
    if (next !== clamped) {
      onChange(next);
    }
    setIsEditing(false);
  };

  const onDraftChange = (next: string) => {
    if (next === '' || /^\d+$/.test(next)) {
      setDraft(next);
    }
  };

  const displayValue =
    zeroAsInfinity && clamped === 0 ? (
      <Infinity className={styles['infinity-icon']} aria-hidden="true" />
    ) : (
      clamped
    );

  const editLabel =
    zeroAsInfinity && clamped === 0
      ? 'Edit quantity (0 is unlimited)'
      : 'Edit quantity';

  return (
    <NumberSelectorTemplate
      value={clamped}
      displayValue={displayValue}
      disabled={disabled}
      decreaseDisabled={disabled || atMin || isEditing}
      increaseDisabled={disabled || atMax || isEditing}
      onDecrease={onDecrease}
      onIncrease={onIncrease}
      decreaseLabel={decreaseLabel}
      increaseLabel={increaseLabel}
      size={size}
      className={className}
      editable={editable}
      isEditing={isEditing}
      draft={draft}
      onStartEdit={onStartEdit}
      onDraftChange={onDraftChange}
      onCommitEdit={onCommitEdit}
      onCancelEdit={onCancelEdit}
      editLabel={editLabel}
    />
  );
};
