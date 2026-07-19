import React from 'react';

export interface FormProps {
  listId: string;
  onSuccess?: () => void;
}

export interface FormTemplateProps {
  email: string;
  setEmail: (email: string) => void;
  role: 'viewer' | 'collaborator';
  setRole: (role: 'viewer' | 'collaborator') => void;
  isLoading: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
}
