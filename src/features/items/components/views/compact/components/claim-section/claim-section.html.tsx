import React from 'react';
import { EnterPanel } from 'shared/ui';
import { ClaimPrompt, ClaimForm } from '../../../../item-presentation';
import { Tags } from 'features/comments';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ClaimSectionTemplate: React.FC<TemplateProps> = ({
  showClaimFormWithActions,
  showClaimFormPrompt,
  showDeleteConfirmPanel,
  showLinkedClaimTags,
  useSyncedConfirmButtons,
  displayItem,
  claimUserId,
  claimActorName,
  itemActions,
  anonymous,
  setAnonymous,
  setShowClaimForm,
  setShowDeleteConfirm,
  linkedClaimPeers,
  wishlistItemsForLinkedClaim,
  onLinkedClaimItemClick,
  allowGroupFunds,
  totalExtractedPrice,
  totalClaimedAmount,
  claimPrompt,
  claimConfirmLabel,
  linkedClaimPeerIds,
  handleClaim,
  handleDelete,
  claimLoading,
  deleteLoading,
  claimFormPanelClassName,
  confirmButtonsClassName,
  actionBtnPrimaryClassName,
  confirmExtensionClassName,
  confirmPromptClassName,
  confirmLinkedTagsClassName,
  actionBtnClassName,
}) => (
  <>
    {showClaimFormWithActions && itemActions ? (
      <EnterPanel animation="dropdown" className={claimFormPanelClassName}>
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
          compact
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
      </EnterPanel>
    ) : null}

    {showClaimFormPrompt ? (
      <EnterPanel animation="dropdown" className={confirmExtensionClassName}>
        <div className={confirmPromptClassName}>
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
          {showLinkedClaimTags ? (
            <div className={confirmLinkedTagsClassName}>
              <Tags
                appearance = {
                  'badges'
                }
                taggedIds = {
                  linkedClaimPeerIds
                }
                items = {
                  wishlistItemsForLinkedClaim
                }
                onItemTaggedClick = {
                  onLinkedClaimItemClick
                }
              />
            </div>
          ) : null}
        </div>
        <div
          className={confirmButtonsClassName}
          {...(useSyncedConfirmButtons
            ? { 'data-col-measure': 'claimActions' }
            : {})}
        >
          <button
            type="button"
            onClick={() => handleClaim()}
            disabled={claimLoading}
            className={actionBtnPrimaryClassName}
          >
            {claimConfirmLabel}
          </button>
          <button
            type="button"
            onClick={() => setShowClaimForm(false)}
            className={actionBtnClassName}
          >
            Cancel
          </button>
        </div>
      </EnterPanel>
    ) : null}

    {showDeleteConfirmPanel ? (
      <EnterPanel animation="dropdown" className={confirmExtensionClassName}>
        <div className={confirmPromptClassName}>
          <span>Delete this item?</span>
        </div>
        <div
          className={confirmButtonsClassName}
          {...(useSyncedConfirmButtons
            ? { 'data-col-measure': 'claimActions' }
            : {})}
        >
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteLoading}
            className={actionBtnPrimaryClassName}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(false)}
            className={actionBtnClassName}
          >
            No
          </button>
        </div>
      </EnterPanel>
    ) : null}
  </>
);
