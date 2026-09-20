import React from 'react';
import type { Props } from './interfaces/props.interface';
import type { ClaimPanel } from './interfaces/claim-panel.type';
import type { ClaimVariant } from './interfaces/template-props.interface';
import type { Size } from './interfaces/size.type';
import { resolveActionButtonsLayoutMode } from './utils/resolve-action-buttons-layout-mode.util';
import { ActionButtonsTemplate } from './action-buttons.html';
import styles from './action-buttons.module.css';

export const ActionButtons: React.FC<Props> = ({
  isOwner,
  canCollaborate,
  isPublicGuest = false,
  canEditItem,
  isArchived = false,
  isExpired = false,
  claimedByCurrentUser,
  isFullyClaimed,
  isClaimUnavailable = false,
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
  hasLinkedUnclaimPeers = false,
  substitutionAction = null,
}) => {
  const layoutMode = resolveActionButtonsLayoutMode({
    isOwner,
    canCollaborate,
    claimedByCurrentUser,
    isFullyClaimed,
    isClaimUnavailable,
    canAdjustClaim,
    isPublicGuest,
    canEditItem,
    isArchived,
    isExpired,
  });

  if (layoutMode == null && !onView) {
    return null;
  }

  const showSuggesterEditActions = !!canEditItem && !canCollaborate;
  const size: Size = compact ? 'sm' : 'md';
  const claimButtonSize: 'sm' | 'md' = size === 'sm' ? 'sm' : 'md';
  const splitLayout = !compact && splitOnMobile;
  const claimsStacked = !compact && !splitOnMobile;
  const showView = !!onView;
  const showEditor = layoutMode === 'owner-edit' || showSuggesterEditActions;
  const showLeading = showView || showEditor;
  const showSubstitution = !!substitutionAction;
  const soloClaimCluster = splitLayout && !showLeading;
  const onlyLeading = layoutMode === 'owner-edit' || (layoutMode == null && showView);

  const stackClassName = [
    compact ? styles['action-buttons__row'] : styles['action-buttons__stack'],
    splitLayout ? styles['action-buttons__stack--split'] : '',
    splitLayout && onlyLeading ? styles['action-buttons__stack--split-trailing'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const confirmClassName =
    compact || splitLayout ? styles['action-buttons__row'] : styles['action-buttons__stack'];

  const iconBtnClassName = [
    styles['action-buttons__icon-btn'],
    splitLayout ? styles['action-buttons__icon-btn--split'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const claimsClusterClassName = [
    styles['action-buttons__claims'],
    claimsStacked ? styles['action-buttons__claims--stacked'] : '',
    soloClaimCluster ? styles['action-buttons__claims--solo'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  let claimPanel: ClaimPanel = 'none';
  let claimLabel = '';
  let claimVariant: ClaimVariant = 'primary';
  let claimDisabled = false;
  let claimClassName = styles['action-buttons__action-btn'];
  let claimOnClick = onClaim;
  let claimShowsLoading = false;

  if (layoutMode === 'unclaim') {
    claimPanel = 'simple';
    claimLabel = hasLinkedUnclaimPeers ? 'Unclaim all' : 'Unclaim';
    claimVariant = 'secondary';
    claimDisabled = unclaimDisabled;
    claimOnClick = onUnclaim;
    claimShowsLoading = true;
    if (soloClaimCluster && !showSubstitution) {
      claimClassName = `${styles['action-buttons__action-btn']} ${styles['action-buttons__action-btn--solo']}`;
    }
  } else if (layoutMode === 'claimed') {
    claimPanel = 'simple';
    claimLabel = 'Claimed';
    claimVariant = 'secondary';
    claimDisabled = true;
    claimOnClick = onClaim;
    claimShowsLoading = false;
    if (soloClaimCluster && !showSubstitution) {
      claimClassName = `${styles['action-buttons__action-btn']} ${styles['action-buttons__action-btn--solo']}`;
    }
  } else if (layoutMode === 'unavailable') {
    claimPanel = 'simple';
    claimLabel = 'Unavailable';
    claimVariant = 'secondary';
    claimDisabled = true;
    claimOnClick = onClaim;
    claimShowsLoading = false;
    if (soloClaimCluster && !showSubstitution) {
      claimClassName = `${styles['action-buttons__action-btn']} ${styles['action-buttons__action-btn--solo']}`;
    }
  } else if (layoutMode === 'update-claim') {
    claimPanel = 'update';
    claimClassName = styles['action-buttons__action-btn'];
    claimOnClick = onClaim;
    claimShowsLoading = true;
  } else if (layoutMode === 'claim') {
    claimPanel = 'simple';
    claimLabel = 'Claim Item';
    claimVariant = 'primary';
    claimDisabled = false;
    claimOnClick = onClaim;
    claimShowsLoading = true;
    if (soloClaimCluster && !showSubstitution) {
      claimClassName = `${styles['action-buttons__action-btn']} ${styles['action-buttons__action-btn--solo']}`;
    }
  }

  const bareClaimOnly = claimPanel !== 'none' && !showLeading && !showSubstitution;
  const updateUnclaimClassName = [
    styles['action-buttons__update'],
    soloClaimCluster ? styles['action-buttons__update--solo'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ActionButtonsTemplate
      stackClassName = {
        stackClassName
      }
      confirmClassName = {
        confirmClassName
      }
      iconBtnClassName = {
        iconBtnClassName
      }
      claimsClusterClassName = {
        claimsClusterClassName
      }
      size = {
        size
      }
      claimButtonSize = {
        claimButtonSize
      }
      bareClaimOnly = {
        bareClaimOnly
      }
      showLeading = {
        showLeading
      }
      showView = {
        showView
      }
      showEditor = {
        showEditor
      }
      showSubstitution = {
        showSubstitution
      }
      claimPanel = {
        claimPanel
      }
      claimLabel = {
        claimLabel
      }
      claimVariant = {
        claimVariant
      }
      claimDisabled = {
        claimDisabled
      }
      claimClassName = {
        claimClassName
      }
      claimOnClick = {
        claimOnClick
      }
      claimShowsLoading = {
        claimShowsLoading
      }
      updateUnclaimClassName = {
        updateUnclaimClassName
      }
      updateUnclaimDisabled = {
        unclaimDisabled
      }
      claimLoading = {
        claimLoading
      }
      showDeleteConfirm = {
        showDeleteConfirm
      }
      deleteLoading = {
        deleteLoading
      }
      substitutionAction = {
        substitutionAction
      }
      substitutionDisabled = {
        claimLoading || unclaimDisabled || showDeleteConfirm
      }
      substitutionClassName = {
        substitutionAction?.mode === 'manage' ? iconBtnClassName : undefined
      }
      onEdit = {
        onEdit
      }
      onView = {
        onView
      }
      onClaim = {
        onClaim
      }
      onUnclaim = {
        onUnclaim
      }
      onDeleteRequest = {
        onDeleteRequest
      }
      onDeleteConfirm = {
        onDeleteConfirm
      }
      onDeleteCancel = {
        onDeleteCancel
      }
    />
  );
};
