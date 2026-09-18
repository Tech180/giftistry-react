import React, { useMemo, useRef, useState } from 'react';
import { CommentInputProps } from '../../interfaces/comment-input-props.interface';
import { CommentInputTemplate } from './comment-input.html';
import {
  TypingIndicator,
  OwnerWarning,
  UploadErrorBar,
  MetaRow,
  AttachmentPreview,
  CommentEditor,
  CommentEditorHandle,
  InputToolbar,
  InputFooter,
} from './components/input';
import { getMentionableParticipants } from '../../utils/comment-content.util';

export const CommentInput: React.FC<CommentInputProps> = ({
  isOwner,
  commentVisibility,
  setCommentVisibility,
  isRollover,
  setIsRollover,
  autoRollover = false,
  content,
  setContent,
  commenterName,
  isSubmitLoading,
  handleSubmit,
  items,
  isTaggingModeActive,
  setIsTaggingModeActive,
  typingUsers,
  isAnonymous,
  setIsAnonymous,
  participants,
  currentUserId,
  listOwnerId,
  imageUrl,
  setImageUrl,
  onMentionSelect,
}) => {
  const editorHandle = useRef<CommentEditorHandle>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  return (
    <CommentInputTemplate
      handleSubmit={handleSubmit}
      typingIndicator={<TypingIndicator typingUsers={typingUsers} />}
      ownerWarning={
        <OwnerWarning
          isOwner={isOwner}
          isOwnerVisible={commentVisibility.mode === 'visibleToAll'}
        />
      }
      uploadErrorBar={uploadError ? <UploadErrorBar message={uploadError} /> : null}
      metaRow={
        <MetaRow
          isOwner={isOwner}
          commenterName={commenterName}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
        />
      }
      attachmentPreview={
        imageUrl ? (
          <AttachmentPreview imageUrl={imageUrl} onRemove={() => setImageUrl?.(null)} />
        ) : null
      }
      editor={
        <CommentEditor
          ref={editorHandle}
          content={content}
          setContent={setContent}
          participants={mentionParticipants}
          currentUserId={currentUserId}
          isOwner={isOwner}
          visibilityMode={commentVisibility.mode}
          selectedUserIds={commentVisibility.selectedUserIds}
          listOwnerId={listOwnerId}
          onSubmit={handleSubmit}
          onMentionAudienceSelect={onMentionSelect}
        />
      }
      toolbar={
        <InputToolbar
          editorHandle={editorHandle}
          content={content}
          imageUrl={imageUrl}
          isSubmitLoading={isSubmitLoading}
          setImageUrl={setImageUrl}
          onUploadError={setUploadError}
        />
      }
      footer={
        <InputFooter
          isOwner={isOwner}
          commentVisibility={commentVisibility}
          setCommentVisibility={setCommentVisibility}
          isRollover={isRollover}
          setIsRollover={setIsRollover}
          autoRollover={autoRollover}
          items={items}
          isTaggingModeActive={isTaggingModeActive}
          setIsTaggingModeActive={setIsTaggingModeActive}
          participants={participants}
          currentUserId={currentUserId}
          listOwnerId={listOwnerId}
        />
      }
    />
  );
};
