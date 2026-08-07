import React from 'react';

export interface ChangePasswordFormTemplateProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showCurrent: boolean;
  showNew: boolean;
  showConfirm: boolean;
  onToggleShowCurrent: () => void;
  onToggleShowNew: () => void;
  onToggleShowConfirm: () => void;
  isLoading: boolean;
  localError: string | null;
  handleSubmit: (e: React.SyntheticEvent) => void;
  passwordHint: string;
}
