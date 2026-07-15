import React from 'react';
import { Check } from 'lucide-react';
import { TaggingControlsProps } from './interfaces/tagging-controls-props.interface';
import styles from './tagging-controls.module.css';

export const TaggingOverlay: React.FC<TaggingControlsProps> = ({
  isTaggingModeActive,
  onSelectTag,
}) => {
  if (!isTaggingModeActive) return null;

  return (
    <button
      type="button"
      className={styles['tagging-overlay']}
      aria-label="Toggle selection"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectTag?.();
      }}
    />
  );
};

export const TaggingSelect: React.FC<TaggingControlsProps> = ({
  isTaggingModeActive,
  isTaggedSelection,
  onSelectTag,
  showInlineSelect = true,
}) => {
  if (!isTaggingModeActive || !showInlineSelect) return null;

  return (
    <button
      type="button"
      className={`${styles['select-indicator']} ${isTaggedSelection ? styles['select-indicator-checked'] : ''}`}
      aria-label={isTaggedSelection ? 'Deselect item' : 'Select item'}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectTag?.();
      }}
    >
      {isTaggedSelection && <Check size={12} strokeWidth={3.5} />}
    </button>
  );
};
