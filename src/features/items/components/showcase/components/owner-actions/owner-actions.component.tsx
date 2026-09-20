import React from 'react';
import type { Props } from './interfaces/props.interface';
import { OwnerActionsTemplate } from './owner-actions.html';
import styles from '../../showcase.module.css';

export const OwnerActions: React.FC<Props> = ({
  isArchived,
  isExpired,
  onEdit,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteLoading,
  handleDelete,
}) => {
  if (isArchived || isExpired || !onEdit) {
    return null;
  }

  return (
    <OwnerActionsTemplate
      onEdit = {
        onEdit
      }
      showDeleteConfirm = {
        showDeleteConfirm
      }
      onConfirmDelete = {
        handleDelete
      }
      onCancelDelete = {
        () => setShowDeleteConfirm(false)
      }
      onRequestDelete = {
        () => setShowDeleteConfirm(true)
      }
      deleteLoading = {
        deleteLoading
      }
      rootClassName = {
        styles['owner-actions']
      }
      editButtonClassName = {
        styles['owner-btn']
      }
      deleteButtonClassName = {
        `${styles['owner-btn']} ${styles['delete-btn']}`
      }
      actionIconClassName = {
        styles['action-icon']
      }
      confirmWidgetClassName = {
        styles['delete-confirm-widget']
      }
      confirmPromptClassName = {
        styles['confirm-prompt']
      }
      confirmButtonsClassName = {
        styles['confirm-buttons']
      }
    />
  );
};
