import React from 'react';
import { AlertCircle } from 'lucide-react';
import { WarningTemplateProps } from './interfaces/warning-template-props.interface';
import styles from './warning.module.css';

export const WarningTemplate: React.FC<WarningTemplateProps> = ({ isOwner, isOwnerVisible }) => {
  if (isOwner || !isOwnerVisible) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.header}>
        <AlertCircle size={14} /> Warning <AlertCircle size={14} />
      </div>
      <div className={styles.text}>The owner will be able to see this message</div>
    </div>
  );
};
