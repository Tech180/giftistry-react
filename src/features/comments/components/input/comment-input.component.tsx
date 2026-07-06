import React, { useRef, useState } from 'react';
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

export const CommentInput: React.FC<CommentInputProps> = ({
  isOwner,
  isOwnerVisible,
  setIsOwnerVisible,
  isRollover,
  setIsRollover,
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
  imageUrl,
  setImageUrl,
}) => {
  const editorHandle = useRef<CommentEditorHandle>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <CommentInputTemplate
      handleSubmit={handleSubmit}
      typingIndicator={<TypingIndicator typingUsers={typingUsers} />}
      ownerWarning={<OwnerWarning isOwner={isOwner} isOwnerVisible={isOwnerVisible} />}
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
          participants={participants}
          currentUserId={currentUserId}
          onSubmit={handleSubmit}
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
          isOwnerVisible={isOwnerVisible}
          setIsOwnerVisible={setIsOwnerVisible}
          isRollover={isRollover}
          setIsRollover={setIsRollover}
          items={items}
          isTaggingModeActive={isTaggingModeActive}
          setIsTaggingModeActive={setIsTaggingModeActive}
        />
      }
    />
  );
};
