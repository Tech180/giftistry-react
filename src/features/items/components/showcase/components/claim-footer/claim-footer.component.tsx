import React from 'react';
import { ClaimForm } from '../../../item-presentation';
import { OwnerActions } from '../owner-actions/owner-actions.component';
import type { Props } from './interfaces/props.interface';
import type { Mode } from './interfaces/mode.type';
import { ClaimFooterTemplate } from './claim-footer.html';
import styles from '../../showcase.module.css';

export const ClaimFooter: React.FC<Props> = ({
  isArchived,
  isExpired,
  isPublicGuest,
  canCollaborate,
  canEditItem,
  canAdjustClaim,
  claimedByCurrentUser,
  isFullyClaimed,
  isClaimUnavailable,
  claimLoading,
  showClaimForm,
  setShowClaimForm,
  handleUnclaim,
  substitutionAction = null,
  substitutionManageIconClassName,
  displayItem,
  metadata,
  claimUserId,
  claimActorName,
  itemActions,
  anonymous,
  setAnonymous,
  linkedClaimPeers,
  wishlistItemsForLinkedClaim,
  onLinkedClaimItemClick,
  allowGroupFunds,
  totalExtractedPrice,
  totalClaimedAmount,
  onEdit,
  showDeleteConfirm,
  setShowDeleteConfirm,
  deleteLoading,
  handleDelete,
}) => {
  const ownerActions = (
    <OwnerActions
      isArchived = {
        isArchived
      }
      isExpired = {
        isExpired
      }
      onEdit = {
        onEdit
      }
      showDeleteConfirm = {
        showDeleteConfirm
      }
      setShowDeleteConfirm = {
        setShowDeleteConfirm
      }
      deleteLoading = {
        deleteLoading
      }
      handleDelete = {
        handleDelete
      }
    />
  );

  if (isArchived || isExpired || isPublicGuest) {
    return (
      <ClaimFooterTemplate
        mode = {
          'hidden'
        }
        showOwnerActions = {
          false
        }
        showClaimForm = {
          false
        }
        claimForm = {
          null
        }
        ownerActions = {
          null
        }
        substitutionAction = {
          null
        }
        substitutionManageIconClassName = {
          undefined
        }
        claimLoading = {
          false
        }
        isClaimUnavailable = {
          false
        }
        claimedByCurrentUser = {
          false
        }
        primaryButtonLabel = {
          ''
        }
        primaryButtonVariant = {
          'primary'
        }
        unclaimLabel = {
          ''
        }
        unavailableLabel = {
          ''
        }
        onOpenClaimForm = {
          () => undefined
        }
        onUnclaim = {
          () => undefined
        }
        footerActionsClassName = {
          styles['claim-footer-actions']
        }
        claimWidgetClassName = {
          styles['claim-widget']
        }
        claimButtonClassName = {
          styles['claim-button']
        }
        unclaimButtonClassName = {
          `${styles['claim-button']} ${styles['unclaim-all-btn']}`
        }
      />
    );
  }

  if (canCollaborate) {
    return (
      <ClaimFooterTemplate
        mode = {
          'owner-only'
        }
        showOwnerActions = {
          true
        }
        showClaimForm = {
          false
        }
        claimForm = {
          null
        }
        ownerActions = {
          ownerActions
        }
        substitutionAction = {
          null
        }
        substitutionManageIconClassName = {
          undefined
        }
        claimLoading = {
          false
        }
        isClaimUnavailable = {
          false
        }
        claimedByCurrentUser = {
          false
        }
        primaryButtonLabel = {
          ''
        }
        primaryButtonVariant = {
          'primary'
        }
        unclaimLabel = {
          ''
        }
        unavailableLabel = {
          ''
        }
        onOpenClaimForm = {
          () => undefined
        }
        onUnclaim = {
          () => undefined
        }
        footerActionsClassName = {
          styles['claim-footer-actions']
        }
        claimWidgetClassName = {
          styles['claim-widget']
        }
        claimButtonClassName = {
          styles['claim-button']
        }
        unclaimButtonClassName = {
          `${styles['claim-button']} ${styles['unclaim-all-btn']}`
        }
      />
    );
  }

  let mode: Mode;
  if (canAdjustClaim) {
    mode = isFullyClaimed && !claimedByCurrentUser ? 'unavailable' : 'quantity';
  } else if (claimedByCurrentUser) {
    mode = 'unclaim';
  } else if (isFullyClaimed) {
    mode = 'unavailable';
  } else {
    mode = 'claim';
  }

  const primaryButtonLabel =
    mode === 'quantity' && claimedByCurrentUser ? 'Update Claim' : 'Claim Item';
  const primaryButtonVariant =
    mode === 'quantity' && claimedByCurrentUser ? 'secondary' : 'primary';
  const unavailableLabel = isClaimUnavailable ? 'Unavailable' : 'Already Claimed';

  const claimForm = (
    <ClaimForm
      item = {
        displayItem
      }
      metadata = {
        metadata
      }
      userId = {
        claimUserId
      }
      claimedByName = {
        claimActorName
      }
      itemActions = {
        itemActions
      }
      anonymous = {
        anonymous
      }
      onAnonymousChange = {
        setAnonymous
      }
      onSubmitted = {
        () => setShowClaimForm(false)
      }
      onCancel = {
        () => setShowClaimForm(false)
      }
      linkedItems = {
        linkedClaimPeers
      }
      wishlistItems = {
        wishlistItemsForLinkedClaim
      }
      onLinkedItemClick = {
        onLinkedClaimItemClick
      }
      allowGroupFunds = {
        allowGroupFunds
      }
      fundingTarget = {
        totalExtractedPrice
      }
      totalClaimedAmount = {
        totalClaimedAmount
      }
    />
  );

  return (
    <ClaimFooterTemplate
      mode = {
        mode
      }
      showOwnerActions = {
        !!canEditItem
      }
      showClaimForm = {
        showClaimForm
      }
      claimForm = {
        claimForm
      }
      ownerActions = {
        ownerActions
      }
      substitutionAction = {
        substitutionAction
      }
      substitutionManageIconClassName = {
        substitutionManageIconClassName
      }
      claimLoading = {
        claimLoading
      }
      isClaimUnavailable = {
        isClaimUnavailable
      }
      claimedByCurrentUser = {
        claimedByCurrentUser
      }
      primaryButtonLabel = {
        primaryButtonLabel
      }
      primaryButtonVariant = {
        primaryButtonVariant
      }
      unclaimLabel = {
        'Unclaim Item'
      }
      unavailableLabel = {
        unavailableLabel
      }
      onOpenClaimForm = {
        () => setShowClaimForm(true)
      }
      onUnclaim = {
        handleUnclaim
      }
      footerActionsClassName = {
        styles['claim-footer-actions']
      }
      claimWidgetClassName = {
        styles['claim-widget']
      }
      claimButtonClassName = {
        styles['claim-button']
      }
      unclaimButtonClassName = {
        `${styles['claim-button']} ${styles['unclaim-all-btn']}`
      }
    />
  );
};
