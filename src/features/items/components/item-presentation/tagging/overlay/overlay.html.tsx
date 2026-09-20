import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './overlay.module.css';

export const OverlayTemplate: React.FC<TemplateProps> = ({
  onSelectTag,
}) => {
  return (
    <button
      type="button"
      className={styles.overlay}
      aria-label="Toggle selection"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelectTag?.();
      }}
    />
  );
};
