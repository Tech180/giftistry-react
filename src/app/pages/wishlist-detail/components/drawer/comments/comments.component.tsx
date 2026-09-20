import React from 'react';
import { DRAWER_TITLE, TAGS_LABEL } from './constants/copy.constant';
import type { Props } from './interfaces/props.interface';
import { CommentsTemplate } from './comments.html';

export const Comments: React.FC<Props> = ({
  isOpen,
  onClose,
  items,
  taggedItemIds,
  setTaggedItemIds,
  isTaggingModeActive,
  setIsTaggingModeActive,
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
  listId,
  listOwnerId,
  ownerUsername,
  ownerDisplayName,
  isOwner,
  isExpired,
  isArchived,
  autoRollover,
  handleItemTaggedClick,
  collapseDrawerWhileTagging = false,
  showDeletedComments,
  onToggleShowDeletedComments,
}) => {
  const drawerTaggingActive = isTaggingModeActive || isReplyTaggingModeActive;
  const drawerTaggedIds = isReplyTaggingModeActive ? replyTaggedItemIds : taggedItemIds;
  const isDrawerOpen = isOpen && !collapseDrawerWhileTagging;

  const onRemoveTaggedId = (id: string) => {
    if (isReplyTaggingModeActive) {
      setReplyTaggedItemIds(replyTaggedItemIds.filter((tagId) => tagId !== id));
      return;
    }
    setTaggedItemIds(taggedItemIds.filter((tagId) => tagId !== id));
  };

  return (
    <CommentsTemplate
      isDrawerOpen = {
        isDrawerOpen
      }
      onClose = {
        onClose
      }
      items = {
        items
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
        listId
      }
      listOwnerId = {
        listOwnerId
      }
      ownerUsername = {
        ownerUsername
      }
      ownerDisplayName = {
        ownerDisplayName
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
        autoRollover
      }
      handleItemTaggedClick = {
        handleItemTaggedClick
      }
      showDeletedComments = {
        showDeletedComments
      }
      onToggleShowDeletedComments = {
        onToggleShowDeletedComments
      }
      drawerTitle = {
        DRAWER_TITLE
      }
      tagsLabel = {
        TAGS_LABEL
      }
      drawerTaggingActive = {
        drawerTaggingActive
      }
      drawerTaggedIds = {
        drawerTaggedIds
      }
      onRemoveTaggedId = {
        onRemoveTaggedId
      }
    />
  );
};
