import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { TagModeToggle } from '../tag-mode-toggle';
import { FooterTemplateProps } from './interfaces/footer-template-props.interface';
import styles from './footer.module.css';

export const FooterTemplate: React.FC<FooterTemplateProps> = ({
  isOwner,
  isOwnerVisible,
  setIsOwnerVisible,
  isRollover,
  setIsRollover,
  items,
  isTaggingModeActive,
  setIsTaggingModeActive,
}) => (
  <div className={styles.row}>
    <div className={styles['tools-left']}>
      {items.length > 0 && (
        <TagModeToggle
          isActive={isTaggingModeActive}
          onToggle={setIsTaggingModeActive}
        />
      )}

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
    </div>

    {!isOwner && (
      <button
        type="button"
        onClick={() => setIsOwnerVisible(!isOwnerVisible)}
        className={`${styles['status-badge']} ${isOwnerVisible ? styles['visible-to-owner'] : styles['invisible-to-owner']}`}
        title="Toggle owner visibility"
      >
        {isOwnerVisible ? (
          <>
            <Eye size={11} /> Visible to Owner
          </>
        ) : (
          <>
            <EyeOff size={11} /> Invisible to Owner
          </>
        )}
      </button>
    )}
  </div>
);
