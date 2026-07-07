import React, { useEffect, useRef, useState } from 'react';
import { ReplyInputProps } from './interfaces/reply-input-props.interface';
import { ReplyInputTemplate } from './reply-input.html';
import { CommentEditorHandle } from '../../../input/components/input/editor';
import { convertMentionsToMarkdown } from '../../../../utils/comment-content.util';

export const ReplyInput: React.FC<ReplyInputProps> = ({
  replyToName,
  participants,
  items,
  currentUserId,
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

  useEffect(() => {
    const timer = window.setTimeout(() => editorHandle.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, []);

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

      await onSubmit(finalContent, imageUrl);
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
      participants={participants}
      currentUserId={currentUserId ?? undefined}
      onSubmit={handleSubmit}
      setImageUrl={setImageUrl}
      onUploadError={setUploadError}
      isSubmitting={isSubmitting}
      isTaggingModeActive={isTaggingModeActive}
      setIsTaggingModeActive={setIsTaggingModeActive}
      onCancel={handleCancel}
    />
  );
};
