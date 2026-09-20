import React from 'react';
import { CLAIM_FORM_PROMPT_CLAIM_LINKED } from '../../../../item-presentation/claim-form/constants/claim-form-copy.constant';
import type { Props } from './interfaces/props.interface';
import { ClaimSectionTemplate } from './claim-section.html';
import styles from '../../view.module.css';

export const ClaimSection: React.FC<Props> = (props) => {
  const hasLinkedPeers = props.linkedClaimPeers.length > 0;
  const footerClassName = [
    styles['view__actions'],
    props.elevateAboveWash ? styles['view__actions--above-wash'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ClaimSectionTemplate
      footerClassName = {
        footerClassName
      }
      claimFormPanelClassName = {
        styles['view__claim-form-panel']
      }
      claimFormActionsClassName = {
        styles['view__claim-form-actions']
      }
      showClaimForm = {
        props.showClaimForm
      }
      isArchived = {
        props.isArchived
      }
      isExpired = {
        props.isExpired
      }
      displayItem = {
        props.displayItem
      }
      claimUserId = {
        props.claimUserId
      }
      claimActorName = {
        props.claimActorName
      }
      itemActions = {
        props.itemActions
      }
      anonymous = {
        props.anonymous
      }
      setAnonymous = {
        props.setAnonymous
      }
      setShowClaimForm = {
        props.setShowClaimForm
      }
      linkedClaimPeers = {
        props.linkedClaimPeers
      }
      wishlistItemsForLinkedClaim = {
        props.wishlistItemsForLinkedClaim
      }
      onLinkedClaimItemClick = {
        props.onLinkedClaimItemClick
      }
      allowGroupFunds = {
        props.allowGroupFunds
      }
      totalExtractedPrice = {
        props.totalExtractedPrice
      }
      totalClaimedAmount = {
        props.totalClaimedAmount
      }
      handleClaim = {
        props.handleClaim
      }
      claimLoading = {
        props.claimLoading
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
      claimPrompt = {
        hasLinkedPeers ? CLAIM_FORM_PROMPT_CLAIM_LINKED : undefined
      }
      claimConfirmLabel = {
        hasLinkedPeers ? 'Claim all' : 'Yes'
      }
      linkedClaimTaggedIds = {
        props.linkedClaimPeers.map((peer) => peer.Id)
      }
    />
  );
};
