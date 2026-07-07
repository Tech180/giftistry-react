import React from 'react';
import { DeleteConfirmProps } from './interfaces/delete-confirm-props.interface';
import styles from './delete-confirm.module.css';

export const DeleteConfirmTemplate: React.FC<DeleteConfirmProps> = ({
  onDelete,
  onCancel,
}) => {
  return (
    <div className={styles['comment-delete-dropdown']}>
      <span className={styles['delete-confirm-text']}>Are you sure you want to delete this comment?</span>
      <div className={styles['delete-confirm-actions']}>
        <button
          type="button"
          className={styles['delete-confirm-btn']}
          onClick={onDelete}
        >
          Delete
        </button>
        <button
          type="button"
          className={styles['delete-cancel-btn']}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
