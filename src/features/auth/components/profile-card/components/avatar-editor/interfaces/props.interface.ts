import type { ChangeEvent, CSSProperties, RefObject } from 'react';

export interface Props {
  avatar: string | null;
  avatarStyle: CSSProperties;
  isImageAvatar: boolean;
  initials: string;
  avatarPickerHex: string;
  randomizeAvatarColor: () => void;
  handleUploadClick: () => void;
  handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleAvatarColorChange: (hex: string) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}
