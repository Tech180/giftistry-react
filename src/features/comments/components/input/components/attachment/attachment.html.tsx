import React from 'react';
import { X } from 'lucide-react';
import { AttachmentTemplateProps } from './interfaces/attachment-template-props.interface';
import styles from './attachment.module.css';

export const AttachmentTemplate: React.FC<AttachmentTemplateProps> = ({
  imageUrl,
  onRemove,
}) => (
  <div className={styles.container}>
    <img src={imageUrl} alt="Attached preview" className={styles.image} />
    <button type="button" onClick={onRemove} className={styles['remove-btn']} title="Remove attachment">
      <X size={14} />
    </button>
  </div>
);
