import type { SyntheticEvent } from 'react';

export interface TemplateProps {
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
  handleSubmit: (e: SyntheticEvent) => void;
  passwordHint: string;
}
