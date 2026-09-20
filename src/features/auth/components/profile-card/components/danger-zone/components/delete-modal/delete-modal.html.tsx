import React from 'react';
import { AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './delete-modal.module.css';

export const DeleteModalTemplate: React.FC<TemplateProps> = ({
  deletePassword,
  setDeletePassword,
  showDeletePassword,
  setShowDeletePassword,
  deleteError,
  isAccountActionLoading,
  onClose,
  onConfirm,
}) => {
  return (
    <div className={styles['delete-modal-overlay']} onClick={onClose}>
      <div
        className={styles['delete-modal']}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="delete-account-title"
        aria-modal="true"
      >
        <div className={styles['delete-modal-header']}>
          <h3 id="delete-account-title" className={styles['delete-modal-title']}>Delete account</h3>
          <button
            type="button"
            className={styles['delete-modal-close']}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <p className={styles['delete-modal-desc']}>
          This action is permanent and cannot be undone. All wishlists and profile data will be removed.
        </p>
        {deleteError && (
          <div className={`${styles.alert} ${styles['alert-error']} ${styles['delete-modal-error']}`}>
            <AlertCircle size={16} />
            <span>{deleteError}</span>
          </div>
        )}
        <div className={styles['input-container']}>
          <label className={styles['input-label']} htmlFor="delete-password">Password</label>
          <div className={styles['password-input-wrap']}>
            <input
              id="delete-password"
              type={showDeletePassword ? 'text' : 'password'}
              className={styles['input-field']}
              placeholder="Enter your password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles['password-toggle']}
              onClick={() => setShowDeletePassword(!showDeletePassword)}
              aria-label={showDeletePassword ? 'Hide password' : 'Show password'}
            >
              {showDeletePassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <div className={styles['delete-modal-actions']}>
          <button
            type="button"
            onClick={onClose}
            disabled={isAccountActionLoading}
            className={`${styles.btn} ${styles['btn-outline']} ${styles['btn-md']}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isAccountActionLoading || !deletePassword}
            className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-md']}`}
          >
            {isAccountActionLoading ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
};
