import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import { DumpsterIcon } from './dumpster-icon';
import styles from './toggle.module.css';

export const ToggleTemplate: React.FC<TemplateProps> = ({
  showDeletedComments,
  onToggle,
}) => (
  <button
    type="button"
    className={`${styles.toggle} ${showDeletedComments ? styles['toggle-active'] : ''}`}
    aria-pressed={showDeletedComments}
    aria-label={showDeletedComments ? 'Hide deleted comments' : 'Show deleted comments'}
    title={showDeletedComments ? 'Hide deleted comments' : 'Show deleted comments'}
    onClick={onToggle}
  >
    <DumpsterIcon size={18} />
  </button>
);
