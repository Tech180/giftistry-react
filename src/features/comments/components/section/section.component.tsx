import React from 'react';
import type { Props } from './interfaces/props.interface';
import { useSection } from './hooks/use-section';
import { SectionTemplate } from './section.html';

export const Section: React.FC<Props> = (props) => {
  const section = useSection(props);

  return (
    <SectionTemplate
      isOwner = {
        section.isOwner
      }
      listOwnerId = {
        section.listOwnerId
      }
      isAuthenticated = {
        section.isAuthenticated
      }
      canPostComments = {
        section.canPostComments
      }
      currentUserId = {
        section.currentUserId
      }
      participants = {
        section.participants
      }
      comments = {
        section.comments
      }
      parentComments = {
        section.parentComments
      }
      repliesMap = {
        section.repliesMap
      }
      handleReplySubmit = {
        section.handleReplySubmit
      }
      toggleReaction = {
        section.toggleReaction
      }
      isLoading = {
        section.isLoading
      }
      displayError = {
        section.displayError
      }
      content = {
        section.content
      }
      setContent = {
        section.setContent
      }
      commenterName = {
        section.commenterName
      }
      setCommenterName = {
        section.setCommenterName
      }
      commentVisibility = {
        section.commentVisibility
      }
      setCommentVisibility = {
        section.setCommentVisibility
      }
      isRollover = {
        section.isRollover
      }
      setIsRollover = {
        section.setIsRollover
      }
      autoRollover = {
        section.autoRollover
      }
      isSubmitLoading = {
        section.isSubmitLoading
      }
      handleSubmit = {
        section.handleSubmit
      }
      formatDate = {
        section.formatDate
      }
      items = {
        section.items
      }
      onlineUsers = {
        section.onlineUsers
      }
      typingUsers = {
        section.typingUsers
      }
      onItemTaggedClick = {
        section.onItemTaggedClick
      }
      handleSelectTagItem = {
        section.handleSelectTagItem
      }
      isTaggingModeActive = {
        section.isTaggingModeActive
      }
      setIsTaggingModeActive = {
        section.setIsTaggingModeActive
      }
      taggedItemIds = {
        section.taggedItemIds
      }
      setTaggedItemIds = {
        section.setTaggedItemIds
      }
      handleDeleteComment = {
        section.handleDeleteComment
      }
      deletingCommentId = {
        section.deletingCommentId
      }
      setDeletingCommentId = {
        section.setDeletingCommentId
      }
      isAnonymous = {
        section.isAnonymous
      }
      setIsAnonymous = {
        section.setIsAnonymous
      }
      imageUrl = {
        section.imageUrl
      }
      setImageUrl = {
        section.setImageUrl
      }
      activeReplyId = {
        section.activeReplyId
      }
      onReplyOpen = {
        section.onReplyOpen
      }
      isReplyTaggingModeActive = {
        section.isReplyTaggingModeActive
      }
      setIsReplyTaggingModeActive = {
        section.setIsReplyTaggingModeActive
      }
      replyTaggedItemIds = {
        section.replyTaggedItemIds
      }
      setReplyTaggedItemIds = {
        section.setReplyTaggedItemIds
      }
      listContainerRef = {
        section.listContainerRef
      }
      onMentionSelect = {
        section.onMentionSelect
      }
      highlightedCommentId = {
        section.highlightedCommentId
      }
    />
  );
};
