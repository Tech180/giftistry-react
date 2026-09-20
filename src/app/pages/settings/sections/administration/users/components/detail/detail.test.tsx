import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, test, vi } from 'vitest';
import { TABS } from './constants/tabs.constant';
import { DetailTemplate } from './detail.html';
import styles from './detail.module.css';

const baseProps = {
  isLoading: false,
  hasUser: true,
  usernameLabel: '@serverowner',
  emailLabel: 'owner@example.com',
  joinedDisplay: 'Unknown',
  metaLine: '0 lists · 0 friends · Last login: — · Last online: —',
  securityDescription: '2FA: Disabled · Passkeys: 0 · Failed logins: 0',
  fieldsDisabled: true,
  switchesDisabled: true,
  paneClassName: `${styles['detail__pane']} ${styles['detail__pane--readonly']}`,
  tabs: TABS,
  activeTab: 'profile' as const,
  activityRows: [],
  featureToggles: [],
  canCreateWishlists: true,
  maxActiveWishlists: 0,
  onCanCreateWishlistsChange: vi.fn(),
  onMaxActiveWishlistsChange: vi.fn(),
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
  newPassword: '',
  isSelf: false,
  onTabChange: vi.fn(),
  onProfileFormChange: vi.fn(),
  onPolicyFlagsChange: vi.fn(),
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

describe('DetailTemplate owner read-only', () => {
  test('shows view-only banner and hides save when isOwnerReadOnly', () => {
    render(
      <MemoryRouter>
        <DetailTemplate {...baseProps} isOwnerReadOnly fieldsDisabled switchesDisabled />
      </MemoryRouter>
    );

    expect(screen.getByText('Server owner — view only')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('serverowner')).toBeDisabled();
  });

  test('allows save when owner views self (not read-only)', () => {
    render(
      <MemoryRouter>
        <DetailTemplate
          {...baseProps}
          isSelf
          isOwnerReadOnly={false}
          fieldsDisabled={false}
          switchesDisabled={false}
          paneClassName={styles['detail__pane']!}
        />
      </MemoryRouter>
    );

    expect(screen.queryByText('Server owner — view only')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
