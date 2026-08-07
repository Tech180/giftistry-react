import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { DEFAULT_USER_POLICY } from 'features/admin';
import type { AdminUser } from 'features/admin';
import { AdminUserDetailTabTemplate } from './admin-user-detail-tab.html';

const ownerUser: AdminUser = {
  Id: 'owner-1',
  Username: 'serverowner',
  Email: 'owner@example.com',
  FirstName: 'Server',
  LastName: 'Owner',
  IsAdmin: true,
  IsOwner: true,
  Policy: DEFAULT_USER_POLICY,
};

const baseProps = {
  isLoading: false,
  user: ownerUser,
  activity: [],
  activeTab: 'profile' as const,
  profileForm: {
    username: 'serverowner',
    email: 'owner@example.com',
    firstName: 'Server',
    lastName: 'Owner',
    bio: '',
  },
  policyFlags: {
    isAdmin: true,
    isDisabled: false,
    isHidden: false,
    forcePasswordChange: false,
    loginAttemptsBeforeLockout: -1,
  },
  policy: DEFAULT_USER_POLICY,
  newPassword: '',
  isSelf: false,
  onTabChange: vi.fn(),
  onProfileFormChange: vi.fn(),
  onPolicyFlagsChange: vi.fn(),
  onPolicyChange: vi.fn(),
  onNewPasswordChange: vi.fn(),
  onSaveProfile: vi.fn(),
  onSavePolicy: vi.fn(),
  onResetPassword: vi.fn(),
  onUnlock: vi.fn(),
  onRevokeSessions: vi.fn(),
  onDelete: vi.fn(),
  canDeleteAccount: false,
  canTransferOwnership: false,
  onTransferOwnership: vi.fn(),
  isTransferringOwnership: false,
};

describe('AdminUserDetailTabTemplate owner read-only', () => {
  test('shows view-only banner and hides save when isOwnerReadOnly', () => {
    render(
      <MemoryRouter>
        <AdminUserDetailTabTemplate {...baseProps} isOwnerReadOnly />
      </MemoryRouter>
    );

    expect(screen.getByText('Server owner — view only')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('serverowner')).toBeDisabled();
  });

  test('allows save when owner views self (not read-only)', () => {
    render(
      <MemoryRouter>
        <AdminUserDetailTabTemplate {...baseProps} isSelf isOwnerReadOnly={false} />
      </MemoryRouter>
    );

    expect(screen.queryByText('Server owner — view only')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByDisplayValue('serverowner')).not.toBeDisabled();
  });
});
