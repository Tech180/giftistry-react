import React from 'react';
import { Button, EnterPanel } from 'shared/ui';
import {
  ClaimPrompt,
  ActionButtons,
  ClaimForm,
} from '../../../../item-presentation';
import { Tags } from 'features/comments';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ClaimSectionTemplate: React.FC<TemplateProps> = ({
  claimFormPanelClassName,
  claimFormActionsClassName,
  actionsClassName,
  showClaimForm,
  isArchived,
  isExpired,
  displayItem,
  claimUserId,
  claimActorName,
  itemActions,
  anonymous,
  setAnonymous,
  setShowClaimForm,
  linkedClaimPeers,
  wishlistItemsForLinkedClaim,
  onLinkedClaimItemClick,
  allowGroupFunds,
  totalExtractedPrice,
  totalClaimedAmount,
  handleClaim,
  claimLoading,
  isOwner,
  canCollaborate,
  isPublicGuest,
  canEditItem,
  claimedByCurrentUser,
  isFullyClaimed,
  isClaimUnavailable,
  canAdjustClaim,
  showDeleteConfirm,
  deleteLoading,
  onEdit,
  onView,
  handleUnclaim,
  setShowDeleteConfirm,
  handleDelete,
  hasLinkedUnclaimPeers,
  substitutionAction,
  claimPrompt,
  claimConfirmLabel,
  linkedClaimTaggedIds,
}) =>
  showClaimForm && !isArchived && !isExpired ? (
    <EnterPanel
      animation = {
        'dropdown'
      }
      className = {
        claimFormPanelClassName
      }
    >
      {itemActions ? (
        <ClaimForm
          item = {
            displayItem
          }
          metadata = {
            displayItem.Metadata
          }
          userId = {
            claimUserId
          }
          claimedByName = {
            claimActorName ?? null
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
          compact = {
            true
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
      ) : (
        <>
          <ClaimPrompt
            anonymous = {
              anonymous
            }
            onAnonymousChange = {
              setAnonymous
            }
            prompt = {
              claimPrompt
            }
          />
          {linkedClaimPeers.length > 0 ? (
            <Tags
              appearance = {
                'badges'
              }
              taggedIds = {
                linkedClaimTaggedIds
              }
              items = {
                wishlistItemsForLinkedClaim
              }
              onItemTaggedClick = {
                onLinkedClaimItemClick
              }
            />
          ) : null}
          <div className={claimFormActionsClassName}>
            <Button
              variant = {
                'primary'
              }
              size = {
                'sm'
              }
              onClick = {
                () => handleClaim()
              }
              isLoading = {
                claimLoading
              }
            >
              {claimConfirmLabel}
            </Button>
            <Button
              variant = {
                'ghost'
              }
              size = {
                'sm'
              }
              onClick = {
                () => setShowClaimForm(false)
              }
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </EnterPanel>
  ) : (
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
        compact = {
          true
        }
        hasLinkedUnclaimPeers = {
          hasLinkedUnclaimPeers
        }
        substitutionAction = {
          substitutionAction
        }
      />
    </div>
  );
