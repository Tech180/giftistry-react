import React from 'react';
import { ActionButtonsProps } from './interfaces/action-buttons-props.interface';
import type { ActionButtonsSize } from './interfaces/action-buttons-template-props.interface';
import { resolveActionButtonsLayoutMode } from './utils/resolve-action-buttons-layout-mode.util';
import { ActionButtonsTemplate } from './action-buttons.html';
import styles from './action-buttons.module.css';

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOwner,
  canCollaborate,
  isPublicGuest = false,
  canEditItem,
  isArchived = false,
  isExpired = false,
  claimedByCurrentUser,
  isFullyClaimed,
  canAdjustClaim = false,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onView,
  onClaim,
  onUnclaim,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  compact = false,
  splitOnMobile = false,
  unclaimDisabled = false,
}) => {
  const layoutMode = resolveActionButtonsLayoutMode({
    isOwner,
    canCollaborate,
    claimedByCurrentUser,
    isFullyClaimed,
    canAdjustClaim,
    isPublicGuest,
    canEditItem,
    isArchived,
    isExpired,
  });

  if (layoutMode == null && !onView) {
    return null;
  }

  const showSuggesterEditActions = !!canEditItem && !isOwner;
  const size: ActionButtonsSize = compact ? 'sm' : 'md';
  const stackClassName = compact
    ? styles['actions-row']
    : splitOnMobile
      ? styles['actions-stack-split']
      : styles['actions-stack'];
  const confirmClassName =
    compact || splitOnMobile ? styles['actions-row'] : styles['actions-stack'];

  return (
    <ActionButtonsTemplate
      layoutMode={layoutMode}
      size={size}
      stackClassName={stackClassName}
      confirmClassName={confirmClassName}
      claimLoading={claimLoading}
      showDeleteConfirm={showDeleteConfirm}
      deleteLoading={deleteLoading}
      showSuggesterEditActions={showSuggesterEditActions}
      onEdit={onEdit}
      onView={onView}
      onClaim={onClaim}
      onUnclaim={onUnclaim}
      onDeleteRequest={onDeleteRequest}
      onDeleteConfirm={onDeleteConfirm}
      onDeleteCancel={onDeleteCancel}
      unclaimDisabled={unclaimDisabled}
    />
  );
};
