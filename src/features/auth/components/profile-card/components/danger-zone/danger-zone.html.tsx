import React from 'react';
import { DeleteModal } from './components/delete-modal/delete-modal.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './danger-zone.module.css';

export const DangerZoneTemplate: React.FC<TemplateProps> = ({
  isAccountActionLoading,
  onDisable,
  onOpenDelete,
  showDeleteModal,
  deletePassword,
  setDeletePassword,
  showDeletePassword,
  setShowDeletePassword,
  deleteError,
  onCloseDeleteModal,
  onConfirmDeleteAccount,
}) => {
  return (
    <>
      <div className={styles['danger-zone-card']}>
        <h3 className={styles['danger-title']}>Danger Zone</h3>
        <p className={styles['danger-desc']}>
          Disabling your account blocks sign-in and makes your wishlists inaccessible. Deleting permanently removes your account and all associated data.
        </p>
        <div className={styles['danger-actions']}>
          <button
            type="button"
            onClick={onDisable}
            disabled={isAccountActionLoading}
            className={`${styles.btn} ${styles['btn-danger-outline']} ${styles['btn-md']}`}
          >
            Disable Account
          </button>
          <button
            type="button"
            onClick={onOpenDelete}
            disabled={isAccountActionLoading}
            className={`${styles.btn} ${styles['btn-danger']} ${styles['btn-md']}`}
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          deletePassword = {
            deletePassword
          }
          setDeletePassword = {
            setDeletePassword
          }
          showDeletePassword = {
            showDeletePassword
          }
          setShowDeletePassword = {
            setShowDeletePassword
          }
          deleteError = {
            deleteError
          }
          isAccountActionLoading = {
            isAccountActionLoading
          }
          onClose = {
            onCloseDeleteModal
          }
          onConfirm = {
            onConfirmDeleteAccount
          }
        />
      )}
    </>
  );
};
