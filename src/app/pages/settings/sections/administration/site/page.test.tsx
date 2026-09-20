import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  REGISTRATION_MODE_LABELS,
  REGISTRATION_MODE_MENU_TITLE,
  REGISTRATION_MODE_OPTIONS,
} from 'features/admin';
import { PageTemplate } from './page.html';
import type { InviteRow } from './interfaces/invite-row.interface';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './page.module.css';

const baseInviteRow = (overrides: Partial<InviteRow> = {}): InviteRow => ({
  id: 'invite-1',
  displayUrl: 'example.com/register?invite=abc',
  statusLabel: 'Active',
  statusClassName: `${styles['page__invite-status']} ${styles['page__invite-status--active']}`,
  expiresLabel: 'Expires —',
  copied: false,
  canCopy: true,
  isDeleting: false,
  onCopy: vi.fn(),
  onDelete: vi.fn(),
  ...overrides,
});

const baseProps: TemplateProps = {
  isLoading: false,
  hasPolicy: true,
  isSaving: false,
  showInviteControls: true,
  registrationMode: 'invite_only',
  registrationModeDescription: REGISTRATION_MODE_LABELS.invite_only,
  registrationModeOptions: REGISTRATION_MODE_OPTIONS,
  registrationModeMenuTitle: REGISTRATION_MODE_MENU_TITLE,
  onRegistrationModeChange: vi.fn(),
  allowPasswordLogin: true,
  onAllowPasswordLoginChange: vi.fn(),
  domainsText: '',
  onDomainsTextChange: vi.fn(),
  inviteTtlHours: 168,
  onInviteTtlHoursChange: vi.fn(),
  inviteMaxUses: 1,
  onInviteMaxUsesChange: vi.fn(),
  inviteSummaryDescription: 'No invite yet — generate to create a link',
  headerInviteDisplayUrl: 'No invite link yet',
  headerInviteCopied: false,
  canCopyHeaderInvite: false,
  onCopyHeaderInvite: vi.fn(),
  onRegenerateInvite: vi.fn(),
  isRegeneratingInvite: false,
  showInviteList: false,
  inviteRows: [],
  requireStrongPasswords: true,
  onRequireStrongPasswordsChange: vi.fn(),
  loginAttemptsBeforeLockout: 5,
  onLoginAttemptsChange: vi.fn(),
  lockoutDurationMinutes: 0,
  onLockoutDurationChange: vi.fn(),
  maintenanceMode: false,
  onMaintenanceModeChange: vi.fn(),
  maintenanceMessage: 'Maintenance',
  onMaintenanceMessageChange: vi.fn(),
  defaultPolicyToggles: [],
  onSave: vi.fn(),
};

describe('Site PageTemplate invite controls', () => {
  test('shows invite controls when mode is invite_only', () => {
    render(<PageTemplate {...baseProps} />);
    expect(screen.getByText('Registration invite link')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate invite link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy invite link' })).toBeInTheDocument();
    expect(screen.getByLabelText('Invite link lifetime in hours')).toBeInTheDocument();
    expect(screen.getByLabelText('Max signups per invite')).toBeInTheDocument();
  });

  test('hides invite controls when mode is open', () => {
    render(
      <PageTemplate
        {...baseProps}
        showInviteControls={false}
        registrationMode="open"
        registrationModeDescription={REGISTRATION_MODE_LABELS.open}
      />
    );
    expect(screen.queryByText('Registration invite link')).not.toBeInTheDocument();
  });

  test('shows copied aria-label when inviteCopied is true', () => {
    render(
      <PageTemplate
        {...baseProps}
        headerInviteDisplayUrl="example.com/register?invite=abc"
        headerInviteCopied
        canCopyHeaderInvite
      />
    );
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  test('lists generated invites with status and delete', () => {
    const onDelete1 = vi.fn();
    const onDelete2 = vi.fn();
    render(
      <PageTemplate
        {...baseProps}
        showInviteList
        inviteRows={[
          baseInviteRow({ id: 'invite-1', statusLabel: 'Active', onDelete: onDelete1 }),
          baseInviteRow({
            id: 'invite-2',
            statusLabel: 'Expired',
            statusClassName: `${styles['page__invite-status']} ${styles['page__invite-status--expired']}`,
            onDelete: onDelete2,
          }),
          baseInviteRow({
            id: 'invite-3',
            statusLabel: 'Completed',
            statusClassName: `${styles['page__invite-status']} ${styles['page__invite-status--completed']}`,
          }),
        ]}
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
    expect(onDelete1).toHaveBeenCalled();
  });
});
