import React from 'react';

export interface PasswordSectionProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isLoading: boolean;
  showCurrent: boolean;
  setShowCurrent: (val: boolean) => void;
  showNew: boolean;
  setShowNew: (val: boolean) => void;
  showConfirm: boolean;
  setShowConfirm: (val: boolean) => void;
  handleUpdatePassword: (e: React.FormEvent) => void;
}
