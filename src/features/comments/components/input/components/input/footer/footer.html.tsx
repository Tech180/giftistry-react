import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TagModeToggle } from '../tag-mode-toggle';
import { CommentVisibilityPanel } from '../../comment-visibility-panel';
import { resolveCommentVisibilityBadgeLabel } from '../../../../../utils/resolve-comment-visibility-badge-label.util';
import type { FooterTemplateProps } from './interfaces/footer-template-props.interface';
import styles from './footer.module.css';

const SHEET_MOBILE_QUERY = '(max-width: 48rem)';

export const FooterTemplate: React.FC<FooterTemplateProps> = ({
  isOwner,
  commentVisibility,
  setCommentVisibility,
  isRollover,
  setIsRollover,
  autoRollover = false,
  items,
  isTaggingModeActive,
  setIsTaggingModeActive,
  participants,
  currentUserId,
  listOwnerId,
  isPanelOpen,
  setIsPanelOpen,
  isMobile,
}) => {
  const mode = commentVisibility.mode;
  const badgeLabel = resolveCommentVisibilityBadgeLabel(
    mode,
    commentVisibility.selectedUserIds.length
  );
  const isHidden = mode === 'hiddenFromOwner';
  const badgeClass = `${styles['status-badge']} ${
    isHidden ? styles['invisible-to-owner'] : styles['visible-to-owner']
  }`;

  return (
    <div className={styles.row}>
      <div className={styles['tools-left']}>
        {items.length > 0 && (
          <TagModeToggle
            isActive={isTaggingModeActive}
            onToggle={setIsTaggingModeActive}
          />
        )}

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

      <div className={styles['visibility-anchor']} data-comment-visibility-anchor>
        <button
          type="button"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={badgeClass}
          title="Comment visibility"
          aria-expanded={isPanelOpen}
          aria-haspopup="dialog"
        >
          {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
          {badgeLabel}
        </button>

        <CommentVisibilityPanel
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          visibility={commentVisibility}
          onChange={setCommentVisibility}
          participants={participants}
          currentUserId={currentUserId}
          listOwnerId={listOwnerId}
          isOwner={isOwner}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};
