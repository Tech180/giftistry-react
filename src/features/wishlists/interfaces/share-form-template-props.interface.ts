import React from 'react';

export interface ShareFormTemplateProps {
  email: string;
  setEmail: (val: string) => void;
  role: 'viewer' | 'collaborator';
  setRole: (val: 'viewer' | 'collaborator') => void;
  isLoading: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}
