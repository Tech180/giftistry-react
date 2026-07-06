import React from 'react';
import { PasskeysSectionProps } from './passkeys-section-props.interface';

export type TwoFactorFlowStep = 'setup-qr' | 'setup-recovery' | 'view-recovery' | 'disable';

export interface TwoFactorSectionProps {
  is2faEnabled: boolean;
  twoFactorStep: 'none' | 'setup' | 'disable';
  setTwoFactorStep: (step: 'none' | 'setup' | 'disable') => void;
  qrCodeUrl: string;
  totpSecret: string;
  accountUsername: string;
  handleSetup2FA: () => Promise<boolean>;
  handleEnable2FA: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  handleDisable2FA: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>;
  recoveryCodes: string[];
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export interface TwoFactorSectionTemplateProps
  extends TwoFactorSectionProps,
    PasskeysSectionProps {
  flowStep: TwoFactorFlowStep | null;
  isExpanded: boolean;
  savedCodesConfirmed: boolean;
  setSavedCodesConfirmed: (confirmed: boolean) => void;
  onToggleSetup: () => void;
  onToggleViewRecovery: () => void;
  onToggleDisable: () => void;
  onCloseExpandable: () => void;
  onCompleteSetup: () => void;
  handleCopySecret: () => void;
  handleCopyRecoveryCodes: () => void;
  handleDownloadRecoveryCodes: () => void;
}
