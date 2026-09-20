import React from 'react';
import type { Props } from './interfaces/props.interface';
import { DeleteModalTemplate } from './delete-modal.html';

export const DeleteModal: React.FC<Props> = ({
  deletePassword,
  setDeletePassword,
  showDeletePassword,
  setShowDeletePassword,
  deleteError,
  isAccountActionLoading,
  onClose,
  onConfirm,
}) => (
  <DeleteModalTemplate
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
      onClose
    }
    onConfirm = {
      onConfirm
    }
  />
);
