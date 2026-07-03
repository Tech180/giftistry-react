import React from 'react';

export interface TwoFactorSectionProps {
  is2faEnabled: boolean;
  twoFactorStep: 'none' | 'setup' | 'disable';
  setTwoFactorStep: (step: 'none' | 'setup' | 'disable') => void;
  qrCodeUrl: string;
  totpSecret: string;
  verificationCode: string;
  setVerificationCode: (val: string) => void;
  handleSetup2FA: () => Promise<void>;
  handleEnable2FA: (e: React.FormEvent) => Promise<void>;
  handleDisable2FA: (e: React.FormEvent) => Promise<void>;
  recoveryCodes: string[];
  setRecoveryCodes: (codes: string[]) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}
