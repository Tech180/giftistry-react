import React from 'react';
import type { DeletedCommentsToggleTemplateProps } from './interfaces/deleted-comments-toggle-template-props.interface';
import { DumpsterIcon } from './dumpster-icon';
import styles from './deleted-comments-toggle.module.css';

export const DeletedCommentsToggleTemplate: React.FC<DeletedCommentsToggleTemplateProps> = ({
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
