import React from 'react';
import type { Props } from './interfaces/props.interface';
import { FooterActionsTemplate } from './footer-actions.html';
import styles from '../../view.module.css';

export const FooterActions: React.FC<Props> = (props) => {
  if (!props.showActionButtons) {
    return null;
  }

  return (
    <FooterActionsTemplate
      footerClassName = {
        props.footerClassName
      }
      actionsClassName = {
        styles['view__footer-actions']
      }
      showClaimForm = {
        props.showClaimForm
      }
      isOwner = {
        props.isOwner
      }
      canCollaborate = {
        props.canCollaborate
      }
      isPublicGuest = {
        props.isPublicGuest
      }
      canEditItem = {
        props.canEditItem
      }
      isArchived = {
        props.isArchived
      }
      isExpired = {
        props.isExpired
      }
      claimedByCurrentUser = {
        props.claimedByCurrentUser
      }
      isFullyClaimed = {
        props.isFullyClaimed
      }
      isClaimUnavailable = {
        props.isClaimUnavailable
      }
      canAdjustClaim = {
        props.canAdjustClaim
      }
      claimLoading = {
        props.claimLoading
      }
      showDeleteConfirm = {
        props.showDeleteConfirm
      }
      deleteLoading = {
        props.deleteLoading
      }
      onEdit = {
        props.onEdit
      }
      onView = {
        props.onView
      }
      setShowClaimForm = {
        props.setShowClaimForm
      }
      handleUnclaim = {
        props.handleUnclaim
      }
      setShowDeleteConfirm = {
        props.setShowDeleteConfirm
      }
      handleDelete = {
        props.handleDelete
      }
      hasLinkedUnclaimPeers = {
        props.hasLinkedUnclaimPeers
      }
      substitutionAction = {
        props.substitutionAction
      }
    />
  );
};
