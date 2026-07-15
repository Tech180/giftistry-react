import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { UserPreviewCard } from 'shared/ui';
import { CommentSectionTemplateProps } from '../../interfaces/comment-section-template-props.interface';
import { CommentItem } from '../item/comment-item.component';
import { CommentInput } from '../input/comment-input.component';
import styles from './comment-section.module.css';

export const CommentSectionTemplate: React.FC<CommentSectionTemplateProps> = ({
  isOwner,
  listOwnerId,
  isAuthenticated,
  currentUserId,
  participants,
  comments,
  parentComments,
  repliesMap,
  handleReplySubmit,
  toggleReaction,
  isLoading,
  displayError,
  content,
  setContent,
  commenterName,
  setCommenterName,
  isOwnerVisible,
  setIsOwnerVisible,
  isRollover,
  setIsRollover,
  isSubmitLoading,
  handleSubmit,
  formatDate,
  items,
  onlineUsers,
  typingUsers,
  onItemTaggedClick,
  handleSelectTagItem,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
  handleDeleteComment,
  deletingCommentId,
  setDeletingCommentId,
  isAnonymous,
  setIsAnonymous,
  imageUrl,
  setImageUrl,
  activeReplyId,
  onReplyOpen,
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
  listContainerRef,
}) => {
  return (
    <div className={styles.section}>




      {displayError && (
        <div className={styles.alert}>
          <AlertCircle size={16} />
          <span>{displayError}</span>
        </div>
      )}

      {/* Comment history list */}
      <div ref={listContainerRef} className={styles['list-container']}>
        {isLoading ? (
          <div className={styles['loading-spinner']}>
            <div className={styles.spinner} />
          </div>
        ) : parentComments.length > 0 ? (
          <div className={styles['comments-list']}>
            {parentComments.map((comment) => (
              <CommentItem
                key={comment.Id}
                comment={comment}
                replies={repliesMap[comment.Id] || []}
                listOwnerId={listOwnerId}
                currentUserId={currentUserId}
                items={items}
                formatDate={formatDate}
                onItemTaggedClick={onItemTaggedClick}
                handleDeleteComment={handleDeleteComment}
                deletingCommentId={deletingCommentId}
                setDeletingCommentId={setDeletingCommentId}
                onlineUsers={onlineUsers}
                participants={participants}
                toggleReaction={toggleReaction}
                handleReplySubmit={handleReplySubmit}
                activeReplyId={activeReplyId}
                onReplyOpen={onReplyOpen}
                isReplyTaggingModeActive={isReplyTaggingModeActive}
                setIsReplyTaggingModeActive={setIsReplyTaggingModeActive}
                replyTaggedItemIds={replyTaggedItemIds}
                setReplyTaggedItemIds={setReplyTaggedItemIds}
                isOwner={isOwner}
                isOwnerVisible={isOwnerVisible}
              />
            ))}
          </div>
        ) : (
          <div className={styles['empty-state-wrap']}>
            <p className={styles['empty-text']}>No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Bottom Chat Message section */}
      <div className={styles['bottom-seamless-container']}>
        {!isAuthenticated ? (
          <div className={styles['auth-prompt']}>
            <p className={styles['auth-prompt-text']}>Sign in to join the conversation.</p>
            <Link to="/login" className={styles['auth-prompt-link']}>Sign in</Link>
          </div>
        ) : (
          <CommentInput
            isOwner={isOwner}
            isOwnerVisible={isOwnerVisible}
            setIsOwnerVisible={setIsOwnerVisible}
            isRollover={isRollover}
            setIsRollover={setIsRollover}
            content={content}
            setContent={setContent}
            commenterName={commenterName}
            setCommenterName={setCommenterName}
            isSubmitLoading={isSubmitLoading}
            handleSubmit={handleSubmit}
            items={items}
            isTaggingModeActive={isTaggingModeActive}
            setIsTaggingModeActive={setIsTaggingModeActive}
            typingUsers={typingUsers}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
            participants={participants}
            currentUserId={currentUserId}
            listOwnerId={listOwnerId}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
          />
        )}
      </div>
    </div>
  );
};
