import React from 'react';
import { Link, Layers2 } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './relations.module.css';

export const RelationsTemplate: React.FC<TemplateProps> = ({
  showLinked,
  showRelated,
  resolvedLinkedCount,
  resolvedRelatedCount,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
}) => {
  if (!showLinked && !showRelated) {
    return null;
  }

  return (
    <div className={styles.relations}>
      {showLinked && (
        <div className={styles['relations__form-group']}>
          <label className={styles['relations__label']}>Linked Items</label>
          <div className={styles['relations__row']}>
            <p className={styles['relations__hint']}>
              These gifts go together. People who claim one can claim the rest at the same time.
            </p>
            <button
              type="button"
              onClick={() => setIsLinkingModeActive(true)}
              className={[
                styles['relations__btn'],
                isLinkingModeActive ? styles['relations__btn--active'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title="Select linked items from wishlist"
              aria-pressed={isLinkingModeActive}
            >
              <Link size={16} />
              {resolvedLinkedCount > 0 && (
                <span className={styles['relations__badge']}>{resolvedLinkedCount}</span>
              )}
            </button>
          </div>
        </div>
      )}

      {showRelated && (
        <div className={styles['relations__form-group']}>
          <label className={styles['relations__label']}>Related Items</label>
          <div className={styles['relations__row']}>
            <p className={styles['relations__hint']}>
              These gifts go well together, but people claim each one on their own.
            </p>
            <button
              type="button"
              onClick={() => setIsRelatingModeActive(true)}
              className={[
                styles['relations__btn'],
                isRelatingModeActive ? styles['relations__btn--active'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              title="Select related items from wishlist"
              aria-pressed={isRelatingModeActive}
            >
              <Layers2 size={16} />
              {resolvedRelatedCount > 0 && (
                <span className={styles['relations__badge']}>{resolvedRelatedCount}</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
