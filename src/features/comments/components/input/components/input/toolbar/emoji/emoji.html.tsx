import React from 'react';
import { Smile } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { EMOJI_CATEGORIES } from '../../../../../../constants/emoji-categories';
import { EmojiTemplateProps } from './interfaces/emoji-template-props.interface';
import { AnchoredPopover } from '../anchored-popover/anchored-popover.component';
import styles from './emoji.module.css';

export const EmojiTemplate: React.FC<EmojiTemplateProps> = ({
  isOpen,
  onToggle,
  anchorRef,
  popoverRef,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  effectiveTheme,
  onEmojiSelect,
}) => {
  const currentCategories = searchQuery.trim()
    ? undefined
    : [{ category: activeCategory, name: EMOJI_CATEGORIES.find((c) => c.id === activeCategory)?.name || '' }];

  return (
    <div ref={anchorRef} className={styles['picker-anchor']}>
      <button
        type="button"
        onClick={onToggle}
        className={`${styles['chat-tool-btn']} ${isOpen ? styles.active : ''}`}
        title="Add Emoji"
      >
        <Smile size={15} />
      </button>
      <AnchoredPopover
        anchorRef={anchorRef}
        popoverRef={popoverRef}
        isOpen={isOpen}
        className={styles['emoji-picker-container-wrapper']}
        estimatedHeight={380}
        estimatedWidth={394}
      >
        <div
          className={styles['emoji-picker-panel']}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.type === 'text') {
              setSearchQuery(target.value || '');
            }
          }}
        >
          <div className={styles['custom-emoji-sidebar']}>
            {EMOJI_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`${styles['custom-cat-btn']} ${activeCategory === cat.id ? styles.active : ''}`}
                title={cat.name}
              >
                {cat.icon}
              </button>
            ))}
          </div>
          <EmojiPicker
            key={`${activeCategory}-${searchQuery ? 'search' : 'normal'}`}
            onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)}
            autoFocusSearch={false}
            theme={effectiveTheme as Theme}
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
            categories={currentCategories}
          />
        </div>
      </AnchoredPopover>
    </div>
  );
};
