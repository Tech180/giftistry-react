import React from 'react';

export interface RegisterFormTemplateProps {
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  isLoading: boolean;
  localError: string | null;
  registrationClosed?: boolean;
  registrationClosedMessage?: string;
  inviteValidating?: boolean;
  oauthEnabled?: boolean;
  oauthButtonText?: string;
  onOauthSignup?: () => void;
  handleSubmit: (e: React.SyntheticEvent) => void;
}
