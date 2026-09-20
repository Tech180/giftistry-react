import React from 'react';
import type { Props } from './interfaces/props.interface';
import { AvatarEditorTemplate } from './avatar-editor.html';

export const AvatarEditor: React.FC<Props> = ({
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
}) => (
  <AvatarEditorTemplate
    avatar = {
      avatar
    }
    avatarStyle = {
      avatarStyle
    }
    isImageAvatar = {
      isImageAvatar
    }
    initials = {
      initials
    }
    avatarPickerHex = {
      avatarPickerHex
    }
    randomizeAvatarColor = {
      randomizeAvatarColor
    }
    handleUploadClick = {
      handleUploadClick
    }
    handleAvatarChange = {
      handleAvatarChange
    }
    handleAvatarColorChange = {
      handleAvatarColorChange
    }
    fileInputRef = {
      fileInputRef
    }
  />
);
