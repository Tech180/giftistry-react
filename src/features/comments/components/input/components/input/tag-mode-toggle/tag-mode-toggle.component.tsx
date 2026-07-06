import React from 'react';
import { Tag, Check } from 'lucide-react';
import styles from './tag-mode-toggle.module.css';

export interface TagModeToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export const TagModeToggle: React.FC<TagModeToggleProps> = ({ isActive, onToggle }) => (
  <div className={styles.wrapper}>
    <button
      type="button"
      onClick={() => onToggle(!isActive)}
      className={`${styles['tag-icon-btn']} ${isActive ? styles.active : ''}`}
      title={isActive ? 'Click checkmark to finish tagging' : 'Tag wishlist items'}
    >
      <Tag size={14} />
    </button>
    {isActive && (
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={styles['tag-check-btn']}
        title="Complete tagging"
      >
        <Check size={14} />
      </button>
    )}
  </div>
);
