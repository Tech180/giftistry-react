import type { CreateUserFormState } from 'features/admin';
import type { FormEvent } from 'react';
import type { UserRow } from './user-row.interface';

export interface TemplateProps {
  rows: UserRow[];
  search: string;
  page: number;
  totalPages: number;
  showPagination: boolean;
  isLoading: boolean;
  showCreate: boolean;
  createForm: CreateUserFormState;
  showCreatePassword: boolean;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onCreateFormChange: (updates: Partial<CreateUserFormState>) => void;
  onToggleCreatePassword: () => void;
  onCreateSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onPageChange: (page: number) => void;
}
