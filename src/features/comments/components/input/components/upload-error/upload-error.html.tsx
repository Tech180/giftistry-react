import React from 'react';
import { AlertCircle } from 'lucide-react';
import { UploadErrorTemplateProps } from './interfaces/upload-error-template-props.interface';
import styles from './upload-error.module.css';

export const UploadErrorTemplate: React.FC<UploadErrorTemplateProps> = ({ message }) => (
  <div className={styles.bar}>
    <AlertCircle size={14} />
    <span>{message}</span>
  </div>
);
