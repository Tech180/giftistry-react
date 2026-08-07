import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import type { AdminUserListItem } from 'features/admin';
import { AdminUsersTabTemplate } from './admin-users-tab.html';

const baseUser = (overrides: Partial<AdminUserListItem> = {}): AdminUserListItem => ({
  Id: 'user-1',
  Username: 'alice',
  Email: 'alice@example.com',
  IsAdmin: false,
  IsOwner: false,
  IsDisabled: false,
  LockedUntil: null,
  ActiveListsCount: 0,
  LastLoginAt: null,
  LastOnline: null,
  ...overrides,
});

const noopProps = {
  search: '',
  page: 1,
  total: 1,
  isLoading: false,
  showCreate: false,
  createForm: {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    isAdmin: false,
    forcePasswordChange: true,
  },
  showCreatePassword: false,
  onSearchChange: vi.fn(),
  onOpenCreate: vi.fn(),
  onCloseCreate: vi.fn(),
  onCreateFormChange: vi.fn(),
  onToggleCreatePassword: vi.fn(),
  onCreateSubmit: vi.fn(),
  onPageChange: vi.fn(),
};

describe('AdminUsersTabTemplate owner action label', () => {
  test('shows View for owner row when current user is not owner', () => {
    render(
      <MemoryRouter>
        <AdminUsersTabTemplate
          {...noopProps}
          currentUserIsOwner={false}
          users={[baseUser({ Id: 'owner-1', Username: 'owner', IsOwner: true, IsAdmin: true })]}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'View' })).toBeInTheDocument();
  });

  test('shows Manage for owner row when current user is owner', () => {
    render(
      <MemoryRouter>
        <AdminUsersTabTemplate
          {...noopProps}
          currentUserIsOwner={true}
          users={[baseUser({ Id: 'owner-1', Username: 'owner', IsOwner: true, IsAdmin: true })]}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Manage' })).toBeInTheDocument();
  });

  test('shows Manage for non-owner rows', () => {
    render(
      <MemoryRouter>
        <AdminUsersTabTemplate
          {...noopProps}
          currentUserIsOwner={false}
          users={[baseUser()]}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Manage' })).toBeInTheDocument();
  });
});
