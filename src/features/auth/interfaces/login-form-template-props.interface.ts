import React from 'react';

export interface LoginFormTemplateProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isLoading: boolean;
  localError: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}
