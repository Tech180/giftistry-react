import React from 'react';

export interface LoginFormTemplateProps {
  email: string;
  setEmail: (val: string) => void;
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
  handleSwitcherSelect: (email: string) => void;
  handleRemoveSwitcherAccount: (email: string) => void;
}
