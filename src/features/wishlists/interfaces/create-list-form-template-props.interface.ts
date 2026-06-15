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
  handleSubmit: (e: React.FormEvent) => void;
}
