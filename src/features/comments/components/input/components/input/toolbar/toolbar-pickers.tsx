import React from 'react';
import type { CommentEditorHandle } from '../editor';
import { EmojiPickerButton } from './emoji';
import { GifPickerButton } from './gif';
import { ImageUploadButton } from './upload';
import { useToolbarPickers } from './use-toolbar-pickers';

export interface ToolbarPickersProps {
  editorHandle: React.RefObject<CommentEditorHandle | null>;
  setImageUrl?: (url: string | null) => void;
  onUploadError: (message: string | null) => void;
}

export const ToolbarPickers: React.FC<ToolbarPickersProps> = ({
  editorHandle,
  setImageUrl,
  onUploadError,
}) => {
  const {
    showEmojiPicker,
    showGifPicker,
    emojiAnchorRef,
    emojiPopoverRef,
    gifAnchorRef,
    gifPopoverRef,
    closePickers,
    toggleEmoji,
    toggleGif,
  } = useToolbarPickers();

  return (
    <>
      <EmojiPickerButton
        isOpen={showEmojiPicker}
        onToggle={toggleEmoji}
        anchorRef={emojiAnchorRef}
        popoverRef={emojiPopoverRef}
        editorHandle={editorHandle}
      />
      <GifPickerButton
        isOpen={showGifPicker}
        onToggle={toggleGif}
        anchorRef={gifAnchorRef}
        popoverRef={gifPopoverRef}
        setImageUrl={setImageUrl}
        onError={onUploadError}
      />
      <ImageUploadButton
        onUpload={(dataUrl) => {
          onUploadError(null);
          setImageUrl?.(dataUrl);
          closePickers();
        }}
        onError={(message) => onUploadError(message)}
      />
    </>
  );
};
