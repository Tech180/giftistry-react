import React from 'react';

export interface LoginFormTemplateProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  localError: string | null;
  handleSubmit: (e: React.SyntheticEvent) => void;

  step: 'credentials' | '2fa';
  setStep: (step: 'credentials' | '2fa') => void;
  totpCode: string;
  setTotpCode: (val: string) => void;
  handleTotpSubmit: (e: React.SyntheticEvent) => void;

  handlePasskeyLogin: () => void;

  switcherAccounts: any[];
  handleSwitcherSelect: (username: string) => void;
  handleRemoveSwitcherAccount: (username: string) => void;

  isBiometricModalOpen: boolean;
  biometricLabel: string;
  cancelBiometrics: () => void;

  allowPasswordLogin: boolean;
  oauthEnabled: boolean;
  oauthButtonText: string;
  handleOauthLogin: () => void;

  showPassword: boolean;
  onToggleShowPassword: () => void;
}
