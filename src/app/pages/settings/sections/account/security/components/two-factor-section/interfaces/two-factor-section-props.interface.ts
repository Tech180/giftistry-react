import type { SyntheticEvent } from 'react';

export interface TwoFactorSectionProps {
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
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}
