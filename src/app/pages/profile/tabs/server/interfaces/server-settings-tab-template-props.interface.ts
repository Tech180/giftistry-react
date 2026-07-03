import React from 'react';

export interface ServerSettingsTabTemplateProps {
  dbType: 'local' | 'remote';
  setDbType: (type: 'local' | 'remote') => void;
  dbUrl: string;
  setDbUrl: (url: string) => void;
  smtpType: 'local' | 'remote';
  setSmtpType: (type: 'local' | 'remote') => void;
  smtpHost: string;
  setSmtpHost: (host: string) => void;
  smtpPort: string;
  setSmtpPort: (port: string) => void;
  smtpUser: string;
  setSmtpUser: (user: string) => void;
  smtpPass: string;
  setSmtpPass: (pass: string) => void;
  smtpSecure: boolean;
  setSmtpSecure: (secure: boolean) => void;
  smtpFrom: string;
  setSmtpFrom: (from: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  isSaving: boolean;
  handleSave: (e: React.FormEvent) => void;
}
