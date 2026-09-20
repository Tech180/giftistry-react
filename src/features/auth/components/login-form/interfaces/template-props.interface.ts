import type { SyntheticEvent } from 'react';
import type { Step } from './step.type';
import type { SwitcherAccount } from './switcher-account.interface';

export interface TemplateProps {
  username: string;
  setUsername: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  localError: string | null;
  handleSubmit: (e: SyntheticEvent) => void;

  step: Step;
  setStep: (step: Step) => void;
  totpCode: string;
  setTotpCode: (val: string) => void;
  handleTotpSubmit: (e: SyntheticEvent) => void;

  handlePasskeyLogin: () => void;

  switcherAccounts: SwitcherAccount[];
  handleSwitcherSelect: (username: string) => void;
  handleRemoveSwitcherAccount: (username: string) => void;

  isBiometricModalOpen: boolean;
  biometricLabel: string;
  cancelBiometrics: () => void;

  allowPasswordLogin: boolean;
  oauthEnabled: boolean;
  oauthButtonText: string;
  handleOauthLogin: () => void;
  showRegisterLink: boolean;

  showPassword: boolean;
  onToggleShowPassword: () => void;
}
