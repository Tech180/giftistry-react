import type { SyntheticEvent } from 'react';
import type { Passkey } from './passkey.interface';

export interface UseSecuritySettingsResult {
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
  handleUpdatePassword: (e: SyntheticEvent<HTMLFormElement>) => void;
  is2faEnabled: boolean;
  twoFactorStep: 'none' | 'setup' | 'disable';
  setTwoFactorStep: (step: 'none' | 'setup' | 'disable') => void;
  qrCodeUrl: string;
  totpSecret: string;
  accountUsername: string;
  handleSetup2FA: () => Promise<boolean>;
  handleEnable2FA: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  handleDisable2FA: (e: SyntheticEvent<HTMLFormElement>) => Promise<void>;
  recoveryCodes: string[];
  setRecoveryCodes: (codes: string[]) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  handleRegisterPasskey: () => Promise<void>;
  passkeys: Passkey[];
  handleDeletePasskey: (id: string) => Promise<void>;
  deletingPasskeyId: string | null;
  setDeletingPasskeyId: (id: string | null) => void;
}
