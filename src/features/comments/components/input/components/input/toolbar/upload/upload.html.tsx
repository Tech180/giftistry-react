import React from 'react';
import { Image } from 'lucide-react';
import { COMMENT_ATTACHMENT_ACCEPT } from '../../../../../../constants/comment-attachment';
import { UploadTemplateProps } from './interfaces/upload-template-props.interface';
import styles from './upload.module.css';

export const UploadTemplate: React.FC<UploadTemplateProps & {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onButtonClick: () => void;
}> = ({ fileInputRef, onFileChange, onButtonClick }) => (
  <div className={styles['picker-wrapper-relative']}>
    <input
      type="file"
      ref={fileInputRef}
      onChange={onFileChange}
      accept={COMMENT_ATTACHMENT_ACCEPT}
      className={styles['hidden-file-input']}
    />
    <button type="button" onClick={onButtonClick} className={styles['chat-tool-btn']} title="Upload Image">
      <Image size={15} />
    </button>
  </div>
);
