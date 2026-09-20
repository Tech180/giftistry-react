import React from 'react';
import { Check } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './select.module.css';

export const SelectTemplate: React.FC<TemplateProps> = ({
  isTaggedSelection,
  onSelectTag,
}) => {
  return (
    <button
      type="button"
      className={[
        styles.select,
        isTaggedSelection ? styles['select--checked'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
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
