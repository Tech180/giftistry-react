import React from 'react';
import type { Props } from './interfaces/props.interface';
import { DangerZoneTemplate } from './danger-zone.html';

export const DangerZone: React.FC<Props> = ({
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
}) => (
  <DangerZoneTemplate
    isAccountActionLoading = {
      isAccountActionLoading
    }
    onDisable = {
      onDisable
    }
    onOpenDelete = {
      onOpenDelete
    }
    showDeleteModal = {
      showDeleteModal
    }
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
    onCloseDeleteModal = {
      onCloseDeleteModal
    }
    onConfirmDeleteAccount = {
      onConfirmDeleteAccount
    }
  />
);
