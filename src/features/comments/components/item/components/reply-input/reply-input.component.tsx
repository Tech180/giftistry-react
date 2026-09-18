import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ReplyInputProps } from './interfaces/reply-input-props.interface';
import { ReplyInputTemplate } from './reply-input.html';
import { CommentEditorHandle } from '../../../input/components/input/editor';
import { InputFooter } from '../../../input/components/input';
import {
  convertMentionsToMarkdown,
  getMentionableParticipants,
} from '../../../../utils/comment-content.util';
import {
  DEFAULT_COMMENT_VISIBILITY,
  OWNER_DEFAULT_COMMENT_VISIBILITY,
} from '../../../../constants/default-comment-visibility.constant';
import type { CommentVisibilityState } from '../../../../interfaces/comment-visibility-state.interface';

export const ReplyInput: React.FC<ReplyInputProps> = ({
  replyToName,
  participants,
  items,
  currentUserId,
  isOwner,
  listOwnerId,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  onSubmit,
  onCancel,
}) => {
  const editorHandle = useRef<CommentEditorHandle>(null);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentVisibility, setCommentVisibility] = useState<CommentVisibilityState>(() =>
    isOwner ? OWNER_DEFAULT_COMMENT_VISIBILITY : DEFAULT_COMMENT_VISIBILITY
  );

  const mentionParticipants = useMemo(
    () =>
      getMentionableParticipants(participants, {
        isOwner,
        mode: commentVisibility.mode,
        selectedUserIds: commentVisibility.selectedUserIds,
        listOwnerId,
      }),
    [participants, isOwner, commentVisibility, listOwnerId]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => editorHandle.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, []);

  const handleMentionAudienceSelect = (userId: string) => {
    setCommentVisibility((prev) => {
      if (prev.mode !== 'visibleToSelected') return prev;
      if (prev.selectedUserIds.includes(userId)) return prev;
      return { ...prev, selectedUserIds: [...prev.selectedUserIds, userId] };
    });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isSubmitting || (!content.trim() && !imageUrl && taggedItemIds.length === 0)) return;

    setIsSubmitting(true);
    try {
      let finalContent = content.trim()
        ? convertMentionsToMarkdown(content.trim(), participants)
        : '';

      if (taggedItemIds.length > 0) {
        const tagLinks = taggedItemIds
          .map((id) => {
            const matchedItem = items.find((item) => item.Id === id);
            return matchedItem ? `[${matchedItem.Name}](item:${id})` : null;
          })
          .filter(Boolean)
          .join(' ');

        if (tagLinks) {
          finalContent = finalContent ? `${finalContent}\n\n${tagLinks}` : tagLinks;
        }
      }

      await onSubmit(finalContent, imageUrl, commentVisibility);
      setContent('');
      setImageUrl(null);
      setUploadError(null);
      setIsTaggingModeActive(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setImageUrl(null);
    setUploadError(null);
    setIsTaggingModeActive(false);
    onCancel();
  };

  return (
    <ReplyInputTemplate
      replyToName={replyToName}
      items={items}
      taggedItemIds={taggedItemIds}
      uploadError={uploadError}
      imageUrl={imageUrl}
      onRemoveAttachment={() => setImageUrl(null)}
      editorHandle={editorHandle}
      content={content}
      setContent={setContent}
      participants={mentionParticipants}
      currentUserId={currentUserId ?? undefined}
      isOwner={isOwner}
      commentVisibility={commentVisibility}
      listOwnerId={listOwnerId}
      onSubmit={handleSubmit}
      setImageUrl={setImageUrl}
      onUploadError={setUploadError}
      isSubmitting={isSubmitting}
      isTaggingModeActive={isTaggingModeActive}
      setIsTaggingModeActive={setIsTaggingModeActive}
      onCancel={handleCancel}
      onMentionAudienceSelect={handleMentionAudienceSelect}
      footer={
        <InputFooter
          isOwner={isOwner}
          commentVisibility={commentVisibility}
          setCommentVisibility={setCommentVisibility}
          isRollover={false}
          setIsRollover={() => undefined}
          autoRollover={false}
          items={items}
          isTaggingModeActive={isTaggingModeActive}
          setIsTaggingModeActive={setIsTaggingModeActive}
          participants={participants}
          currentUserId={currentUserId ?? undefined}
          listOwnerId={listOwnerId}
        />
      }
    />
  );
};
