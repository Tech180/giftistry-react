import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { DEMO_SAM_COMMENT_ID, TOUR_TARGETS } from 'features/tour';
import type { TemplateProps } from './interfaces/template-props.interface';
import { Item } from '../item/item.component';
import { Input } from '../input/input.component';
import styles from './section.module.css';

const ATTENTION_PULSE_CLASS = 'attention-pulse';

export const SectionTemplate: React.FC<TemplateProps> = ({
  isOwner,
  listOwnerId,
  isAuthenticated,
  canPostComments,
  currentUserId,
  participants,
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
  commentVisibility,
  setCommentVisibility,
  isRollover,
  setIsRollover,
  autoRollover = false,
  isSubmitLoading,
  handleSubmit,
  formatDate,
  items,
  onlineUsers,
  typingUsers,
  onItemTaggedClick,
  isTaggingModeActive,
  setIsTaggingModeActive,
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
  onMentionSelect,
  highlightedCommentId,
}) => {
  return (
    <div className={styles.section}>
      {displayError && (
        <div className={styles.alert}>
          <AlertCircle size={16} />
          <span>{displayError}</span>
        </div>
      )}

      <div ref={listContainerRef} className={styles['list-container']} data-tour={TOUR_TARGETS.demoComments}>
        {isLoading ? (
          <div className={styles['loading-spinner']}>
            <div className={styles.spinner} />
          </div>
        ) : parentComments.length > 0 ? (
          <div className={styles['comments-list']}>
            {parentComments.map((comment) => {
              const isTourComment = comment.Id === DEMO_SAM_COMMENT_ID;
              const shellClass =
                comment.Id === highlightedCommentId ? ATTENTION_PULSE_CLASS : undefined;

              return (
                <div
                  key={comment.Id}
                  className={shellClass}
                  data-tour={isTourComment ? TOUR_TARGETS.demoNewComment : undefined}
                >
                  <Item
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
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles['empty-state-wrap']}>
            <p className={styles['empty-text']}>No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>

      <div className={styles['bottom-seamless-container']}>
        {!isAuthenticated ? (
          <div className={styles['auth-prompt']}>
            <p className={styles['auth-prompt-text']}>Sign in to join the conversation.</p>
            <Link to="/login" className={styles['auth-prompt-link']}>
              Sign in
            </Link>
          </div>
        ) : !canPostComments ? (
          <div className={styles['auth-prompt']}>
            <p className={styles['auth-prompt-text']}>Comments are read-only for archived lists.</p>
          </div>
        ) : (
          <Input
            isOwner={isOwner}
            commentVisibility={commentVisibility}
            setCommentVisibility={setCommentVisibility}
            isRollover={isRollover}
            setIsRollover={setIsRollover}
            autoRollover={autoRollover}
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
            onMentionSelect={onMentionSelect}
          />
        )}
      </div>
    </div>
  );
};
