import React from 'react';
import type { Props } from './interfaces/props.interface';
import { ClaimDrawerTemplate } from './claim-drawer.html';
import styles from '../../view.module.css';

export const ClaimDrawer: React.FC<Props> = (props) => {
  return (
    <ClaimDrawerTemplate
      drawerClassName = {
        props.drawerClassName
      }
      innerClassName = {
        styles['view__claim-drawer-inner']
      }
      fallbackClassName = {
        styles['view__claim-fallback']
      }
      fallbackActionsClassName = {
        styles['view__claim-fallback-actions']
      }
      showClaimDrawerContent = {
        props.showClaimDrawerContent
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
      hasLinkedClaimPeers = {
        props.hasLinkedClaimPeers
      }
      linkedClaimTaggedIds = {
        props.linkedClaimTaggedIds
      }
      claimFormPrompt = {
        props.claimFormPrompt
      }
      claimConfirmLabel = {
        props.claimConfirmLabel
      }
    />
  );
};
