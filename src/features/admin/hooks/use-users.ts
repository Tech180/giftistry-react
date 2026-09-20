import { useEffect, useState, type FormEvent } from 'react';
import { validateUsername } from 'shared/utils/validate-username.util';
import { adminApi } from '../api/admin.api';
import { DEFAULT_USER_POLICY } from '../constants/default-user-policy.constant';
import { INITIAL_CREATE_FORM } from '../constants/initial-create-form.constant';
import { USERS_PAGE_SIZE } from '../constants/users-page-size.constant';
import type { CreateUserFormState } from '../interfaces/create-user-form-state.interface';
import type { UseUsersProps } from '../interfaces/use-users-props.interface';
import type { UseUsersResult } from '../interfaces/use-users-result.interface';
import type { UserListItem } from '../interfaces/user-list-item.interface';

export function useUsers({ showToast, currentUser }: UseUsersProps): UseUsersResult {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserFormState>(INITIAL_CREATE_FORM);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.listUsers({ search, page });
      setUsers(res.Users);
      setTotal(res.Total);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, [search, page]);

  const onCreateSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const usernameCheck = validateUsername(createForm.username);
    if (!usernameCheck.ok) {
      showToast(usernameCheck.message, 'error');
      return;
    }
    const email = createForm.email.trim();
    try {
      await adminApi.createUser({
        ...createForm,
        username: usernameCheck.value,
        email,
        emailVerified: !!email,
        policy: DEFAULT_USER_POLICY,
      });
      showToast('User created successfully', 'success');
      setShowCreate(false);
      setCreateForm(INITIAL_CREATE_FORM);
      setShowCreatePassword(false);
      void loadUsers();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to create user', 'error');
    }
  };

  return {
    users,
    search,
    page,
    totalPages: Math.max(1, Math.ceil(total / USERS_PAGE_SIZE)),
    showPagination: total > USERS_PAGE_SIZE,
    isLoading,
    showCreate,
    createForm,
    showCreatePassword,
    currentUserIsOwner: !!currentUser?.IsOwner,
    onSearchChange: (value) => {
      setSearch(value);
      setPage(1);
    },
    onOpenCreate: () => setShowCreate(true),
    onCloseCreate: () => {
      setShowCreate(false);
      setShowCreatePassword(false);
    },
    onCreateFormChange: (updates) => setCreateForm((prev) => ({ ...prev, ...updates })),
    onToggleCreatePassword: () => setShowCreatePassword((prev) => !prev),
    onCreateSubmit,
    onPageChange: setPage,
  };
}
