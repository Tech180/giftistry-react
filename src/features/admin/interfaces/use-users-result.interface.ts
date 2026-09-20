import type { FormEvent } from 'react';
import type { CreateUserFormState } from './create-user-form-state.interface';
import type { UserListItem } from './user-list-item.interface';

export interface UseUsersResult {
  users: UserListItem[];
  search: string;
  page: number;
  totalPages: number;
  showPagination: boolean;
  isLoading: boolean;
  showCreate: boolean;
  createForm: CreateUserFormState;
  showCreatePassword: boolean;
  currentUserIsOwner: boolean;
  onSearchChange: (value: string) => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onCreateFormChange: (updates: Partial<CreateUserFormState>) => void;
  onToggleCreatePassword: () => void;
  onCreateSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onPageChange: (page: number) => void;
}
