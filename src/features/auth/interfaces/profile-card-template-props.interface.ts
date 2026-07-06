import React from 'react';
import { User } from 'app/providers/interfaces/user.interface';

export interface ProfileCardTemplateProps {
  user: any;
  username: string;
  setUsername: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  bio: string;
  setBio: (val: string) => void;
  avatar: string | null;
  setAvatar: (val: string | null) => void;
  isLoading: boolean;
  hasChanges: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  handleSubmit: (e: React.SyntheticEvent) => void;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  randomizeAvatarColor: () => void;
  handleDeleteAccount: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleUploadClick: () => void;
  initials: string;
  isImageAvatar: boolean;
  avatarStyle: React.CSSProperties;
}
