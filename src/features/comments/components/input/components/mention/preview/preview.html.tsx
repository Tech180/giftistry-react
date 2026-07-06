import React from 'react';
import { UserPreviewCard } from 'shared/ui/user-preview-card';
import { PreviewTemplateProps } from './interfaces/preview-template-props.interface';
import styles from './preview.module.css';

export const PreviewTemplate: React.FC<PreviewTemplateProps> = ({ hoveredUser, onClear }) => {
  if (!hoveredUser) return null;

  return (
    <div
      className={styles.overlay}
      style={{
        left: hoveredUser.rect.left,
        top: hoveredUser.rect.top,
        width: hoveredUser.rect.width,
        height: hoveredUser.rect.height,
      }}
      onMouseLeave={onClear}
    >
      <UserPreviewCard userId={hoveredUser.userId} displayName={hoveredUser.displayName}>
        <div className={styles.trigger} />
      </UserPreviewCard>
    </div>
  );
};
