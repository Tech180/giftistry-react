import React from 'react';
import { ActionButtons } from '../../../../item-presentation';
import type { TemplateProps } from './interfaces/template-props.interface';

export const FooterActionsTemplate: React.FC<TemplateProps> = ({
  footerClassName,
  actionsClassName,
  showClaimForm,
  isOwner,
  canCollaborate,
  isPublicGuest,
  canEditItem,
  isArchived,
  isExpired,
  claimedByCurrentUser,
  isFullyClaimed,
  isClaimUnavailable,
  canAdjustClaim,
  claimLoading,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onView,
  setShowClaimForm,
  handleUnclaim,
  setShowDeleteConfirm,
  handleDelete,
  hasLinkedUnclaimPeers,
  substitutionAction,
}) => (
  <footer className={footerClassName} hidden={showClaimForm || undefined}>
    <div className={actionsClassName}>
      <ActionButtons
        isOwner = {
          isOwner
        }
        canCollaborate = {
          canCollaborate
        }
        isPublicGuest = {
          isPublicGuest
        }
        canEditItem = {
          canEditItem
        }
        isArchived = {
          isArchived
        }
        isExpired = {
          isExpired
        }
        claimedByCurrentUser = {
          claimedByCurrentUser
        }
        isFullyClaimed = {
          isFullyClaimed
        }
        isClaimUnavailable = {
          isClaimUnavailable
        }
        canAdjustClaim = {
          canAdjustClaim
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
        onEdit = {
          onEdit
        }
        onView = {
          onView
        }
        onClaim = {
          () => setShowClaimForm(true)
        }
        onUnclaim = {
          handleUnclaim
        }
        onDeleteRequest = {
          () => setShowDeleteConfirm(true)
        }
        onDeleteConfirm = {
          handleDelete
        }
        onDeleteCancel = {
          () => setShowDeleteConfirm(false)
        }
        splitOnMobile = {
          true
        }
        unclaimDisabled = {
          showClaimForm
        }
        hasLinkedUnclaimPeers = {
          hasLinkedUnclaimPeers
        }
        substitutionAction = {
          substitutionAction
        }
      />
    </div>
  </footer>
);
