import React from 'react';

export interface CreateListFormTemplateProps {
  title: string;
  setTitle: (val: string) => void;
  expiresAt: string;
  setExpiresAt: (val: string) => void;
  allowGroupFunds: boolean;
  setAllowGroupFunds: (val: boolean) => void;
  isLoading: boolean;
  errorMsg: string | null;
  handleSubmit: (e: React.SyntheticEvent) => void;
  category: string;
  setCategory: (val: string) => void;
  customCategory: string;
  setCustomCategory: (val: string) => void;
  aiEnabled: boolean;
  setAiEnabled: (val: boolean) => void;
  webSearchEnabled: boolean;
  setWebSearchEnabled: (val: boolean) => void;
  autoRollover: boolean;
  setAutoRollover: (val: boolean) => void;
  globalAiEnabled: boolean;
  globalWebSearchEnabled: boolean;
  onCancel?: () => void;
}
