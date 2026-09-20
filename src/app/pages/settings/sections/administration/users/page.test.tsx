import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { PageTemplate } from './page.html';
import type { UserRow } from './interfaces/user-row.interface';

const baseRow = (overrides: Partial<UserRow> = {}): UserRow => ({
  id: 'user-1',
  usernameLabel: '@alice',
  emailLabel: 'alice@example.com',
  roleLabel: 'User',
  roleClassName: 'badge',
  statusLabel: 'Active',
  statusClassName: 'badge',
  activeListsLabel: 0,
  lastLoginLabel: '—',
  lastOnlineLabel: '—',
  manageHref: '/settings/admin/users/user-1',
  manageLabel: 'Manage',
  ...overrides,
});

const noopProps = {
  search: '',
  page: 1,
  totalPages: 1,
  showPagination: false,
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

describe('Users PageTemplate owner action label', () => {
  test('shows View for owner row when current user is not owner', () => {
    render(
      <MemoryRouter>
        <PageTemplate
          {...noopProps}
          rows={[
            baseRow({
              id: 'owner-1',
              usernameLabel: '@owner',
              manageHref: '/settings/admin/users/owner-1',
              manageLabel: 'View',
              roleLabel: 'Owner',
            }),
          ]}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'View' })).toBeInTheDocument();
  });

  test('shows Manage for owner row when current user is owner', () => {
    render(
      <MemoryRouter>
        <PageTemplate
          {...noopProps}
          rows={[
            baseRow({
              id: 'owner-1',
              usernameLabel: '@owner',
              manageHref: '/settings/admin/users/owner-1',
              manageLabel: 'Manage',
              roleLabel: 'Owner',
            }),
          ]}
        />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Manage' })).toBeInTheDocument();
  });

  test('shows Manage for non-owner rows', () => {
    render(
      <MemoryRouter>
        <PageTemplate {...noopProps} rows={[baseRow()]} />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Manage' })).toBeInTheDocument();
  });
});
