import React from 'react';
import { Dices, Upload } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './avatar-editor.module.css';

export const AvatarEditorTemplate: React.FC<TemplateProps> = ({
  avatar,
  avatarStyle,
  isImageAvatar,
  initials,
  avatarPickerHex,
  randomizeAvatarColor,
  handleUploadClick,
  handleAvatarChange,
  handleAvatarColorChange,
  fileInputRef,
}) => {
  return (
    <div className={styles['avatar-column']}>
      <div className={styles['avatar-wrapper']}>
        <div className={styles['avatar-preview']}>
          <div className={styles['avatar-media']} key={avatar ?? 'default'} style={avatarStyle}>
            {!isImageAvatar && <span className={styles['avatar-initials']}>{initials}</span>}
          </div>
          <button
            type="button"
            className={`${styles['avatar-action']} ${styles['avatar-action-left']}`}
            onClick={randomizeAvatarColor}
            title="Randomize color"
            aria-label="Randomize color"
          >
            <Dices size={14} />
          </button>
          <button
            type="button"
            className={`${styles['avatar-action']} ${styles['avatar-action-right']}`}
            onClick={handleUploadClick}
            title="Upload profile picture"
            aria-label="Upload profile picture"
          >
            <Upload size={14} />
          </button>
        </div>
      </div>

      <div className={styles['avatar-color-picker']}>
        <label className={styles['avatar-color-label']} htmlFor="avatar-color-input">
          Avatar color
        </label>
        <div className={styles['avatar-color-control']}>
          <span className={styles['avatar-color-value']}>{avatarPickerHex.toUpperCase()}</span>
          <div className={styles['avatar-color-picker-wrapper']}>
            <input
              id="avatar-color-input"
              type="color"
              value={avatarPickerHex}
              onChange={(e) => handleAvatarColorChange(e.target.value)}
              aria-label="Pick avatar color"
            />
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};
