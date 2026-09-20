import React from 'react';
import { FundingWidget } from '../../../../item-presentation';
import { TrailingActions } from '../trailing-actions/trailing-actions.component';
import type { Props } from './interfaces/props.interface';

export const SecondaryRowTemplate: React.FC<Props> = ({
  secondaryClassName,
  reserveFunding,
  fundingCol,
  hasFundingContent,
  totalExtractedPrice,
  totalClaimedAmount,
  reserveTrailing,
  trailingCol,
  trailingClassName,
  actionBtnClassName,
  actionBtnClaimClassName,
  actionBtnClaimDangerClassName,
  primaryLink,
  primaryLinkTitle,
  primaryLinkAriaLabel,
  onView,
  showCompactActions,
  canShowEditActions,
  onEdit,
  setShowDeleteConfirm,
  showGuestClaimActions,
  claimActionsClassName,
  useSyncedClaimActionWidth,
  substitutionAction,
  claimLoading,
  showClaimForm,
  claimedByCurrentUser,
  canAdjustClaim,
  handleUnclaim,
  setShowClaimForm,
  isClaimUnavailable,
  isFullyClaimed,
  unclaimLabel,
  actionsClassName,
  actionBtnDangerClassName,
}) => (
  <div className={secondaryClassName}>
    {reserveFunding && (
      <div
        className={fundingCol.className}
        data-col="funding"
        {...(fundingCol.measure ? { 'data-col-measure': 'funding' } : {})}
      >
        {hasFundingContent ? (
          <FundingWidget
            totalExtractedPrice={totalExtractedPrice}
            totalClaimedAmount={totalClaimedAmount}
            label=""
          />
        ) : null}
      </div>
    )}

    <TrailingActions
      reserveTrailing = {
        reserveTrailing
      }
      trailingCol = {
        trailingCol
      }
      trailingClassName = {
        trailingClassName
      }
      actionBtnClassName = {
        actionBtnClassName
      }
      actionBtnClaimClassName = {
        actionBtnClaimClassName
      }
      actionBtnClaimDangerClassName = {
        actionBtnClaimDangerClassName
      }
      primaryLink = {
        primaryLink
      }
      primaryLinkTitle = {
        primaryLinkTitle
      }
      primaryLinkAriaLabel = {
        primaryLinkAriaLabel
      }
      onView = {
        onView
      }
      showCompactActions = {
        showCompactActions
      }
      canShowEditActions = {
        canShowEditActions
      }
      onEdit = {
        onEdit
      }
      setShowDeleteConfirm = {
        setShowDeleteConfirm
      }
      showGuestClaimActions = {
        showGuestClaimActions
      }
      claimActionsClassName = {
        claimActionsClassName
      }
      useSyncedClaimActionWidth = {
        useSyncedClaimActionWidth
      }
      substitutionAction = {
        substitutionAction
      }
      claimLoading = {
        claimLoading
      }
      showClaimForm = {
        showClaimForm
      }
      claimedByCurrentUser = {
        claimedByCurrentUser
      }
      canAdjustClaim = {
        canAdjustClaim
      }
      handleUnclaim = {
        handleUnclaim
      }
      setShowClaimForm = {
        setShowClaimForm
      }
      isClaimUnavailable = {
        isClaimUnavailable
      }
      isFullyClaimed = {
        isFullyClaimed
      }
      unclaimLabel = {
        unclaimLabel
      }
      actionsClassName = {
        actionsClassName
      }
      actionBtnDangerClassName = {
        actionBtnDangerClassName
      }
    />
  </div>
);
