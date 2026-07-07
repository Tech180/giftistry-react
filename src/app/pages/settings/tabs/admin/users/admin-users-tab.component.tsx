import React, { useCallback, useEffect, useState } from 'react';
import { adminApi, DEFAULT_USER_POLICY } from 'features/admin';
import type { AdminUser } from 'features/admin';
import { AdminTabProps } from '../interfaces/admin-tab-props.interface';
import { AdminUsersTabTemplate } from './admin-users-tab.html';
import type { CreateUserFormState } from './interfaces/admin-users-tab-template-props.interface';

const INITIAL_CREATE_FORM: CreateUserFormState = {
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  isAdmin: false,
  forcePasswordChange: true,
};

export const AdminUsersTab: React.FC<AdminTabProps> = ({ showToast }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserFormState>(INITIAL_CREATE_FORM);

  const loadUsers = useCallback(async () => {
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
  }, [search, page, showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await adminApi.createUser({
        ...createForm,
        emailVerified: true,
        policy: DEFAULT_USER_POLICY,
      });
      showToast('User created successfully', 'success');
      setShowCreate(false);
      setCreateForm(INITIAL_CREATE_FORM);
      loadUsers();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to create user', 'error');
    }
  };

  return (
    <AdminUsersTabTemplate
      users={users}
      search={search}
      page={page}
      total={total}
      isLoading={isLoading}
      showCreate={showCreate}
      createForm={createForm}
      onSearchChange={(value) => {
        setSearch(value);
        setPage(1);
      }}
      onOpenCreate={() => setShowCreate(true)}
      onCloseCreate={() => setShowCreate(false)}
      onCreateFormChange={(updates) => setCreateForm((prev) => ({ ...prev, ...updates }))}
      onCreateSubmit={handleCreate}
      onPageChange={setPage}
    />
  );
};
