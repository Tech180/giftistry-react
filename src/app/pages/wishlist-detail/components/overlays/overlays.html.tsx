import React from 'react';
import { createPortal } from 'react-dom';
import { AddItem } from '../drawer/add-item/add-item.component';
import { Comments } from '../drawer/comments/comments.component';
import { ApplyBar } from '../apply-bar/apply-bar.component';
import { ShareModal } from '../share-modal/share-modal.component';
import styles from '../../page.module.css';
import type { TemplateProps } from './interfaces/template-props.interface';

export const OverlaysTemplate: React.FC<TemplateProps> = ({
  wishlist,
  items,
  isOwner,
  canCollaborate,
  isPublicGuest = false,
  isExpired,
  isArchived,
  isLocked,
  isItemFormSessionActive,
  editingItem,
  setEditingItem,
  viewingItem,
  setViewingItem,
  linkableItems,
  resolvedLinkedItems,
  resolvedRelatedItems,
  linkedItemIds,
  setLinkedItemIds,
  relatedItemIds,
  setRelatedItemIds,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
  collapseDrawerWhileLinking,
  handleLinkingAudienceChange,
  canUseWebSearchOnList = false,
  clearSubstitutionAutoOpen,
  setIsAddOpen,
  setEditingItemDraft,
  reloadListContent,
  onAutoAddStarted,
  listShares,
  handleItemTaggedClick,
  claimerSubstitutionCreateNonce,
  claimerSubstitutionEditNonce,
  claimerSubstitutionEditId,
  viewMode,
  isCommentsOpen,
  setIsCommentsOpen,
  displayItems,
  taggedItemIds,
  setTaggedItemIds,
  isTaggingModeActive,
  setIsTaggingModeActive,
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
  collapseDrawerWhileTagging,
  showDeletedComments,
  onToggleShowDeletedComments,
  showApplyBar,
  isShareOpen,
  setIsShareOpen,
  isMobileFab,
  isHighlightInteractionLocked = false,
}) => (
  <>
    {(!isPublicGuest || !!viewingItem) && (
      <AddItem
        isOpen = {
          isItemFormSessionActive
        }
        editingItem = {
          editingItem
        }
        viewingItem = {
          viewingItem
        }
        items = {
          items
        }
        linkableItems = {
          linkableItems
        }
        resolvedLinkedItems = {
          resolvedLinkedItems
        }
        resolvedRelatedItems = {
          resolvedRelatedItems
        }
        linkedItemIds = {
          linkedItemIds
        }
        setLinkedItemIds = {
          setLinkedItemIds
        }
        relatedItemIds = {
          relatedItemIds
        }
        setRelatedItemIds = {
          setRelatedItemIds
        }
        isLinkingModeActive = {
          isLinkingModeActive
        }
        setIsLinkingModeActive = {
          setIsLinkingModeActive
        }
        isRelatingModeActive = {
          isRelatingModeActive
        }
        setIsRelatingModeActive = {
          setIsRelatingModeActive
        }
        collapseDrawerWhileLinking = {
          collapseDrawerWhileLinking
        }
        handleLinkingAudienceChange = {
          handleLinkingAudienceChange
        }
        isOwner = {
          isOwner
        }
        canCollaborate = {
          canCollaborate && !isLocked
        }
        listId = {
          wishlist.Id
        }
        listAiEnabled = {
          !!wishlist.AiEnabled
        }
        listManualJobBackground = {
          wishlist.ManualJobBackground !== false
        }
        canUseWebSearchOnList = {
          canUseWebSearchOnList
        }
        onClose = {
          () => {
            clearSubstitutionAutoOpen();
            setIsAddOpen(false);
            setEditingItem(null);
            setEditingItemDraft(null);
            setViewingItem(null);
            setIsLinkingModeActive(false);
            setIsRelatingModeActive(false);
          }
        }
        onSuccess = {
          () => {
            clearSubstitutionAutoOpen();
            setIsAddOpen(false);
            setEditingItem(null);
            setEditingItemDraft(null);
            setViewingItem(null);
            setIsLinkingModeActive(false);
            setIsRelatingModeActive(false);
            void reloadListContent();
          }
        }
        onAutoEnrichStarted = {
          onAutoAddStarted
        }
        setEditingItemDraft = {
          setEditingItemDraft
        }
        loadData = {
          reloadListContent
        }
        listShares = {
          listShares
        }
        onItemTaggedClick = {
          handleItemTaggedClick
        }
        autoOpenClaimerSubstitutionNonce = {
          claimerSubstitutionCreateNonce
        }
        autoOpenClaimerSubstitutionEditNonce = {
          claimerSubstitutionEditNonce
        }
        autoOpenClaimerSubstitutionEditId = {
          claimerSubstitutionEditId
        }
      />
    )}

    {viewMode !== 'grid' && !isPublicGuest ? (
      <Comments
        isOpen = {
          isCommentsOpen
        }
        onClose = {
          () => setIsCommentsOpen(false)
        }
        items = {
          displayItems
        }
        taggedItemIds = {
          taggedItemIds
        }
        setTaggedItemIds = {
          setTaggedItemIds
        }
        isTaggingModeActive = {
          isTaggingModeActive
        }
        setIsTaggingModeActive = {
          setIsTaggingModeActive
        }
        isReplyTaggingModeActive = {
          isReplyTaggingModeActive
        }
        setIsReplyTaggingModeActive = {
          setIsReplyTaggingModeActive
        }
        replyTaggedItemIds = {
          replyTaggedItemIds
        }
        setReplyTaggedItemIds = {
          setReplyTaggedItemIds
        }
        listId = {
          wishlist.Id
        }
        listOwnerId = {
          wishlist.UserId
        }
        ownerUsername = {
          wishlist.OwnerUsername
        }
        ownerDisplayName = {
          wishlist.OwnerFirstName
            ? wishlist.OwnerFirstName
            : wishlist.OwnerUsername
        }
        isOwner = {
          isOwner
        }
        isExpired = {
          isExpired
        }
        isArchived = {
          isArchived
        }
        autoRollover = {
          wishlist.AutoRollover === true
        }
        handleItemTaggedClick = {
          handleItemTaggedClick
        }
        collapseDrawerWhileTagging = {
          collapseDrawerWhileTagging
        }
        showDeletedComments = {
          showDeletedComments
        }
        onToggleShowDeletedComments = {
          onToggleShowDeletedComments
        }
      />
    ) : null}

    {showApplyBar ? (
      <ApplyBar
        onApply = {
          () => {
            setIsLinkingModeActive(false);
            setIsRelatingModeActive(false);
            setIsTaggingModeActive(false);
            setIsReplyTaggingModeActive(false);
          }
        }
      />
    ) : null}

    {!isPublicGuest && !isMobileFab ? (
      <ShareModal
        isOpen = {
          isShareOpen
        }
        onClose = {
          () => setIsShareOpen(false)
        }
        listId = {
          wishlist.Id
        }
        isOwner = {
          isOwner
        }
      />
    ) : null}

    {isHighlightInteractionLocked
      ? createPortal(
          <div
            className = {
              styles['page__highlight-lock']
            }
            aria-hidden = {
              'true'
            }
            data-testid = {
              'highlight-interaction-lock'
            }
          />,
          document.body
        )
      : null}
  </>
);
