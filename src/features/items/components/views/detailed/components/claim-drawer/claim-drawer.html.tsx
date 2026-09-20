import React from 'react';
import { Button } from 'shared/ui';
import { ClaimForm, ClaimPrompt } from '../../../../item-presentation';
import { Tags } from 'features/comments';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ClaimDrawerTemplate: React.FC<TemplateProps> = ({
  drawerClassName,
  innerClassName,
  fallbackClassName,
  fallbackActionsClassName,
  showClaimDrawerContent,
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
  hasLinkedClaimPeers,
  linkedClaimTaggedIds,
  claimFormPrompt,
  claimConfirmLabel,
}) => (
  <div className={drawerClassName}>
    <div className={innerClassName}>
      {showClaimDrawerContent
        ? itemActions ? (
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
            <div className={fallbackClassName}>
              <ClaimPrompt
                anonymous = {
                  anonymous
                }
                onAnonymousChange = {
                  setAnonymous
                }
                prompt = {
                  claimFormPrompt
                }
              />
              {hasLinkedClaimPeers ? (
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
              <div className={fallbackActionsClassName}>
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
            </div>
          )
        : null}
    </div>
  </div>
);
