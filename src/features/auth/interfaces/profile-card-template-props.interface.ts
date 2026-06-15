import React from 'react';
import { User } from 'app/providers/AuthContext';

export interface ProfileCardTemplateProps {
  user: User;
  username: string;
  setUsername: (val: string) => void;
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  isLoading: boolean;
  errorMsg: string | null;
  successMsg: string | null;
  handleSubmit: (e: React.FormEvent) => void;
}
