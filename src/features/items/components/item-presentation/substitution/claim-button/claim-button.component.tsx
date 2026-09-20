import React, { useState } from 'react';
import {
  ADD_CUSTOM_SUBSTITUTION_MODAL_TITLE,
  ADD_SUBSTITUTION_ACTION_LABEL,
  DELETE_SUBSTITUTION_ACTION_LABEL,
  EDIT_SUBSTITUTION_ACTION_LABEL,
  SUBSTITUTION_DISABLED_WARNING,
} from '../../../../constants/substitution-messages.constant';
import type { Props } from './interfaces/props.interface';
import { ClaimButtonTemplate } from './claim-button.html';

export const ClaimButton: React.FC<Props> = ({
  allowSubstitutions,
  mode = 'create',
  disabled = false,
  appearance = 'secondary',
  size = 'sm',
  className,
  onOpenEditor,
  onDelete,
}) => {
  const [showDisabledConfirm, setShowDisabledConfirm] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const createLabel =
    appearance === 'ghost-text'
      ? ADD_SUBSTITUTION_ACTION_LABEL
      : ADD_CUSTOM_SUBSTITUTION_MODAL_TITLE;

  const openEditor = () => {
    setShowDisabledConfirm(false);
    setWarningOpen(false);
    onOpenEditor();
  };

  const handleRequest = () => {
    if (mode === 'manage' || allowSubstitutions) {
      openEditor();
      return;
    }
    setShowDisabledConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!onDelete) {
      return;
    }
    setDeleteBusy(true);
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <ClaimButtonTemplate
      mode = {
        mode
      }
      allowSubstitutions = {
        allowSubstitutions
      }
      showDisabledConfirm = {
        showDisabledConfirm
      }
      showDeleteConfirm = {
        showDeleteConfirm
      }
      warningOpen = {
        warningOpen
      }
      disabled = {
        disabled
      }
      busy = {
        deleteBusy
      }
      appearance = {
        appearance
      }
      size = {
        size
      }
      className = {
        className
      }
      createLabel = {
        createLabel
      }
      editLabel = {
        EDIT_SUBSTITUTION_ACTION_LABEL
      }
      deleteLabel = {
        DELETE_SUBSTITUTION_ACTION_LABEL
      }
      warningText = {
        SUBSTITUTION_DISABLED_WARNING
      }
      onRequest = {
        handleRequest
      }
      onDisabledConfirm = {
        () => setWarningOpen(true)
      }
      onDisabledCancel = {
        () => setShowDisabledConfirm(false)
      }
      onDeleteRequest = {
        () => setShowDeleteConfirm(true)
      }
      onDeleteConfirm = {
        () => {
          void handleDeleteConfirm();
        }
      }
      onDeleteCancel = {
        () => setShowDeleteConfirm(false)
      }
      onWarningClose = {
        () => setWarningOpen(false)
      }
      onWarningContinue = {
        openEditor
      }
    />
  );
};
