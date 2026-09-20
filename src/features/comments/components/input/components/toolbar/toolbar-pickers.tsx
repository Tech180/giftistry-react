import React from 'react';
import { EmojiPickerButton } from './emoji';
import { GifPickerButton } from './gif';
import { ImageUploadButton } from './upload';
import type { ToolbarPickersProps } from './interfaces/pickers-props.interface';
import { useToolbarPickers } from './use-toolbar-pickers';

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
