import { useEffect, useRef, useState, type RefObject } from 'react';

const isOutside = (target: Node, ...refs: Array<RefObject<HTMLElement | null>>) =>
  refs.every((ref) => !ref.current?.contains(target));

export function useToolbarPickers() {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const emojiAnchorRef = useRef<HTMLDivElement>(null);
  const emojiPopoverRef = useRef<HTMLDivElement>(null);
  const gifAnchorRef = useRef<HTMLDivElement>(null);
  const gifPopoverRef = useRef<HTMLDivElement>(null);

  const closePickers = () => {
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const toggleEmoji = () => {
    setShowEmojiPicker((prev) => !prev);
    setShowGifPicker(false);
  };

  const toggleGif = () => {
    setShowGifPicker((prev) => !prev);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (showEmojiPicker && isOutside(target, emojiAnchorRef, emojiPopoverRef)) {
        setShowEmojiPicker(false);
      }
      if (showGifPicker && isOutside(target, gifAnchorRef, gifPopoverRef)) {
        setShowGifPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker, showGifPicker]);

  return {
    showEmojiPicker,
    showGifPicker,
    emojiAnchorRef,
    emojiPopoverRef,
    gifAnchorRef,
    gifPopoverRef,
    closePickers,
    toggleEmoji,
    toggleGif,
  };
}
