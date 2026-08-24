import React, { Suspense, lazy } from 'react';
import { Smile } from 'lucide-react';
import { EMOJI_CATEGORIES } from '../../../../../../constants/emoji-categories';
import { EmojiTemplateProps } from './interfaces/emoji-template-props.interface';
import { AnchoredPopover } from '../anchored-popover/anchored-popover.component';
import styles from './emoji.module.css';

const EmojiPickerPanel = lazy(() => import('./emoji-picker-panel.component'));

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
  buttonClassName,
}) => {
  return (
    <div ref={anchorRef} className={styles['picker-anchor']}>
      <button
        type="button"
        onClick={onToggle}
        className={
          buttonClassName
            ?? `${styles['chat-tool-btn']} ${isOpen ? styles.active : ''}`
        }
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
          {isOpen ? (
            <Suspense fallback={<div className={styles['emoji-picker-loading']} aria-hidden />}>
              <EmojiPickerPanel
                activeCategory={activeCategory}
                searchQuery={searchQuery}
                effectiveTheme={effectiveTheme}
                onEmojiSelect={onEmojiSelect}
              />
            </Suspense>
          ) : null}
        </div>
      </AnchoredPopover>
    </div>
  );
};
