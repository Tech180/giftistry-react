import React from 'react';

export interface LoginFormTemplateProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  localError: string | null;
  handleSubmit: (e: React.SyntheticEvent) => void;

  // 2FA step
  step: 'credentials' | '2fa' | 'email-otp';
  setStep: (step: 'credentials' | '2fa' | 'email-otp') => void;
  totpCode: string;
  setTotpCode: (val: string) => void;
  handleTotpSubmit: (e: React.SyntheticEvent) => void;

  // Email Magic Link OTP step
  emailOtpToken: string;
  setEmailOtpToken: (val: string) => void;
  handleEmailOtpSend: (e: React.SyntheticEvent) => void;
  handleEmailOtpVerify: (e: React.SyntheticEvent) => void;

  // Passwordless & SSO
  handlePasskeyLogin: () => void;
  handleGitHubLogin: () => void;

  // Account Switcher
  switcherAccounts: any[];
  handleSwitcherSelect: (email: string) => void;
  handleRemoveSwitcherAccount: (email: string) => void;
}
