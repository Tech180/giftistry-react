import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './input.module.css';

export const InputTemplate: React.FC<TemplateProps> = ({
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
