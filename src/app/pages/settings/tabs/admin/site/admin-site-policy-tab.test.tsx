import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { AdminSitePolicyTabTemplate } from './admin-site-policy-tab.html';
import type { AdminSitePolicyTabTemplateProps } from './interfaces/admin-site-policy-tab-template-props.interface';
import type { RegistrationInviteListItem, SitePolicy } from 'features/admin';
import { DEFAULT_USER_POLICY } from 'features/admin';

const basePolicy: SitePolicy = {
  RegistrationMode: 'invite_only',
  LoginAttemptsBeforeLockout: 5,
  LockoutDurationMinutes: 0,
  MaintenanceMode: false,
  MaintenanceMessage: 'Maintenance',
  AllowPasswordLogin: true,
  RequireStrongPasswords: true,
  AllowedEmailDomains: [],
  RegistrationInviteTtlHours: 168,
  RegistrationInviteMaxUses: 1,
  DefaultUserPolicy: { ...DEFAULT_USER_POLICY },
};

const activeInvite: RegistrationInviteListItem = {
  Id: 'invite-1',
  Url: 'https://example.com/register?invite=abc',
  Status: 'active',
  ExpiresAt: '2099-01-01T00:00:00.000Z',
  MaxUses: 1,
  UseCount: 0,
  CreatedAt: '2026-01-01T00:00:00.000Z',
};

const expiredInvite: RegistrationInviteListItem = {
  Id: 'invite-2',
  Url: 'https://example.com/register?invite=old',
  Status: 'expired',
  ExpiresAt: '2020-01-01T00:00:00.000Z',
  MaxUses: 1,
  UseCount: 0,
  CreatedAt: '2019-01-01T00:00:00.000Z',
};

const completedInvite: RegistrationInviteListItem = {
  Id: 'invite-3',
  Url: 'https://example.com/register?invite=done',
  Status: 'completed',
  ExpiresAt: '2099-01-01T00:00:00.000Z',
  MaxUses: 1,
  UseCount: 1,
  CreatedAt: '2026-01-01T00:00:00.000Z',
};

const baseProps: AdminSitePolicyTabTemplateProps = {
  isLoading: false,
  policy: basePolicy,
  domainsText: '',
  isSaving: false,
  inviteStatus: {
    HasActiveInvite: false,
    IsExpired: false,
    IsCompleted: false,
    ExpiresAt: null,
    MaxUses: null,
    UseCount: 0,
    CreatedAt: null,
    Invites: [],
  },
  inviteUrl: null,
  inviteCopied: false,
  inviteCopiedId: null,
  isInviteLoading: false,
  isRegeneratingInvite: false,
  deletingInviteId: null,
  onPolicyChange: vi.fn(),
  onDomainsTextChange: vi.fn(),
  onDefaultPolicyToggle: vi.fn(),
  onSave: vi.fn(),
  onRegenerateInvite: vi.fn(),
  onCopyInviteUrl: vi.fn(),
  onDeleteInvite: vi.fn(),
};

describe('AdminSitePolicyTabTemplate invite controls', () => {
  test('shows invite controls when mode is invite_only', () => {
    render(<AdminSitePolicyTabTemplate {...baseProps} />);
    expect(screen.getByText('Registration invite link')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate invite link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy invite link' })).toBeInTheDocument();
    expect(screen.getByLabelText('Invite link lifetime in hours')).toBeInTheDocument();
    expect(screen.getByLabelText('Max signups per invite')).toBeInTheDocument();
  });

  test('hides invite controls when mode is open', () => {
    render(
      <AdminSitePolicyTabTemplate
        {...baseProps}
        policy={{ ...basePolicy, RegistrationMode: 'open' }}
      />
    );
    expect(screen.queryByText('Registration invite link')).not.toBeInTheDocument();
  });

  test('shows copied aria-label when inviteCopied is true', () => {
    render(
      <AdminSitePolicyTabTemplate
        {...baseProps}
        inviteUrl="https://example.com/register?invite=abc"
        inviteCopied
      />
    );
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  test('lists generated invites with status and delete', () => {
    const onDeleteInvite = vi.fn();
    render(
      <AdminSitePolicyTabTemplate
        {...baseProps}
        inviteStatus={{
          ...baseProps.inviteStatus!,
          HasActiveInvite: true,
          Invites: [activeInvite, expiredInvite, completedInvite],
        }}
        inviteUrl={activeInvite.Url}
        onDeleteInvite={onDeleteInvite}
      />
    );

    expect(screen.getByLabelText('Generated invite links')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Expired')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.queryByText(/^\d+ signups$/)).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d+ \/ \d+$/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete invite link invite-1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete invite link invite-2' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete invite link invite-1' }));
    expect(onDeleteInvite).toHaveBeenCalledWith(activeInvite);
  });
});
