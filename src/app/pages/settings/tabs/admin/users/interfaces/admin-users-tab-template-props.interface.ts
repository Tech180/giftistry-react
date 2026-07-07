import React from 'react';
import type { AdminUser } from 'features/admin';

export interface CreateUserFormState {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  forcePasswordChange: boolean;
}

export interface AdminUsersTabTemplateProps {
  users: AdminUser[];
  search: string;
  page: number;
  total: number;
  isLoading: boolean;
  showCreate: boolean;
  createForm: CreateUserFormState;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onCreateFormChange: (updates: Partial<CreateUserFormState>) => void;
  onCreateSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  onPageChange: (page: number) => void;
}
