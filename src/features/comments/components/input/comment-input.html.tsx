import React from 'react';
import { CommentInputTemplateProps } from '../../interfaces/comment-input-template-props.interface';
import styles from './comment-input.module.css';

export const CommentInputTemplate: React.FC<CommentInputTemplateProps> = ({
  handleSubmit,
  typingIndicator,
  ownerWarning,
  uploadErrorBar,
  metaRow,
  attachmentPreview,
  editor,
  toolbar,
  footer,
}) => (
  <>
    {typingIndicator}
    {ownerWarning}
    {uploadErrorBar}

    <form onSubmit={handleSubmit} className={styles.form}>
      {metaRow}
      {attachmentPreview}

      <div className={styles['input-card']}>
        <div className={styles['editor-slot']}>{editor}</div>
        {toolbar}
      </div>

      {footer}
    </form>
  </>
);
