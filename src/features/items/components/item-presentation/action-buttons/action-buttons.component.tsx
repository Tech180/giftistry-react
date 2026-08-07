import React from 'react';
import { ActionButtonsProps } from './interfaces/action-buttons-props.interface';
import type {
  ActionButtonsLayoutMode,
  ActionButtonsSize,
} from './interfaces/action-buttons-template-props.interface';
import { ActionButtonsTemplate } from './action-buttons.html';
import styles from './action-buttons.module.css';

function resolveLayoutMode(
  isOwner: boolean,
  canCollaborate: boolean,
  claimedByCurrentUser: boolean,
  isFullyClaimed: boolean
): ActionButtonsLayoutMode | null {
  if (isOwner && canCollaborate) {
    return 'owner-edit';
  }
  if (isOwner) {
    return null;
  }
  if (claimedByCurrentUser) {
    return 'unclaim';
  }
  if (isFullyClaimed) {
    return 'claimed';
  }
  return 'claim';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isOwner,
  canCollaborate,
  isArchived = false,
  claimedByCurrentUser,
  isFullyClaimed,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onClaim,
  onUnclaim,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  compact = false,
  splitOnMobile = false,
}) => {
  if (isArchived) {
    return null;
  }

  const layoutMode = resolveLayoutMode(
    isOwner,
    canCollaborate,
    claimedByCurrentUser,
    isFullyClaimed
  );

  if (layoutMode == null) {
    return null;
  }

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
      onEdit={onEdit}
      onClaim={onClaim}
      onUnclaim={onUnclaim}
      onDeleteRequest={onDeleteRequest}
      onDeleteConfirm={onDeleteConfirm}
      onDeleteCancel={onDeleteCancel}
    />
  );
};
