import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TagModeToggle } from '../tag-mode-toggle';
import { VisibilityPanel } from '../visibility-panel';
import { COMMENT_VISIBILITY_PICKER_DISABLED_TITLE } from '../../../../constants/comment-visibility-labels.constant';
import type { FooterTemplateProps } from './interfaces/footer-template-props.interface';
import styles from './footer.module.css';

export const FooterTemplate: React.FC<FooterTemplateProps> = ({
  isOwner,
  commentVisibility,
  setCommentVisibility,
  isRollover,
  setIsRollover,
  autoRollover = false,
  items,
  showTagModeToggle,
  footerLayout,
  isTaggingModeActive,
  setIsTaggingModeActive,
  participants,
  currentUserId,
  listOwnerId,
  isPanelOpen,
  setIsPanelOpen,
  isMobile,
  isChooseWhoEnabled,
  isVisibilityPickerEnabled,
  badgeLabel,
  anchorRef,
}) => {
  const mode = commentVisibility.mode;
  const isHidden = mode === 'hiddenFromOwner';
  const badgeClass = `${styles['status-badge']} ${
    isHidden ? styles['invisible-to-owner'] : styles['visible-to-owner']
  }`;

  const rowClassName = [
    styles.row,
    footerLayout === 'reply' ? styles['row--reply-tools'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rowClassName}>
      {footerLayout === 'default' ? (
        <div className={styles['tools-left']}>
          {showTagModeToggle && items.length > 0 ? (
            <TagModeToggle
              isActive={isTaggingModeActive}
              onToggle={setIsTaggingModeActive}
            />
          ) : null}

          {autoRollover ? (
            <label className={styles['rock-toggle-wrapper']} title="Toggle Rollover">
              <input
                type="checkbox"
                checked={isRollover}
                onChange={(e) => setIsRollover(e.target.checked)}
              />
              <div className={styles['rock-toggle-track']}>
                <div className={styles['rock-tumbler']}>
                  <div className={styles['rock-texture']} />
                </div>
              </div>
              <span className={styles['rock-toggle-label']}>Rollover</span>
            </label>
          ) : null}
        </div>
      ) : null}

      <div
        ref={anchorRef}
        className={styles['visibility-anchor']}
        data-comment-visibility-anchor
      >
        <button
          type="button"
          onClick={() => {
            if (!isVisibilityPickerEnabled) {
              return;
            }
            setIsPanelOpen(!isPanelOpen);
          }}
          disabled={!isVisibilityPickerEnabled}
          aria-disabled={!isVisibilityPickerEnabled}
          className={badgeClass}
          title={
            isVisibilityPickerEnabled
              ? 'Comment visibility'
              : COMMENT_VISIBILITY_PICKER_DISABLED_TITLE
          }
          aria-expanded={isPanelOpen}
          aria-haspopup="dialog"
        >
          {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
          {badgeLabel}
        </button>

        <VisibilityPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          visibility={commentVisibility}
          onChange={setCommentVisibility}
          participants={participants}
          currentUserId={currentUserId}
          listOwnerId={listOwnerId}
          isOwner={isOwner}
          isMobile={isMobile}
          isChooseWhoEnabled={isChooseWhoEnabled}
          anchorRef={anchorRef}
        />
      </div>
    </div>
  );
};
