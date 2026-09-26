import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { LinkInvite } from '../../../../../../interfaces/link-invite.interface';

const listLinkInvitesMock = vi.fn();

vi.mock('features/wishlists/api/wishlists.api', () => ({
  wishlistsApi: {
    listLinkInvites: (...args: unknown[]) => listLinkInvitesMock(...args),
    generateShareLink: vi.fn(),
    revokeShareLink: vi.fn(),
  },
}));

vi.mock('react-qr-code', () => ({
  QRCode: ({
    value,
    'aria-label': ariaLabel,
  }: {
    value: string;
    'aria-label'?: string;
  }) => <div data-testid="share-qr" data-value={value} aria-label={ariaLabel} />,
}));

import { LinkTab } from './link.component';

const activeInviteWithToken: LinkInvite = {
  Id: 'invite-1',
  ListId: 'list-1',
  Token: 'tok-abc',
  Role: 'viewer',
  CreatedBy: 'user-1',
  ExpiresAt: null,
  MaxUses: null,
  UseCount: 0,
  RevokedAt: null,
  PasswordProtected: false,
  CreatedAt: new Date().toISOString(),
};

const activeInviteWithoutToken: LinkInvite = {
  ...activeInviteWithToken,
  Id: 'invite-2',
  Token: null,
};

describe('LinkTab QR', () => {
  beforeEach(() => {
    listLinkInvitesMock.mockReset();
  });

  test('shows QR for classic variant when share URL exists', async () => {
    listLinkInvitesMock.mockResolvedValue([activeInviteWithToken]);

    render(
      <LinkTab
        listId = {
          'list-1'
        }
        isOwner
        variant = {
          'classic'
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/QR code for share link/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId('share-qr')).toHaveAttribute(
      'data-value',
      `${window.location.origin}/invite/list/tok-abc`
    );
  });

  test('shows QR for compact variant when share URL exists', async () => {
    listLinkInvitesMock.mockResolvedValue([activeInviteWithToken]);

    render(
      <LinkTab
        listId = {
          'list-1'
        }
        isOwner
        variant = {
          'compact'
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/QR code for share link/i)).toBeInTheDocument();
    });
  });

  test('hides QR when active invite has no token', async () => {
    listLinkInvitesMock.mockResolvedValue([activeInviteWithoutToken]);

    render(
      <LinkTab
        listId = {
          'list-1'
        }
        isOwner
        variant = {
          'classic'
        }
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/created before URLs were stored/i)).toBeInTheDocument();
    });
    expect(screen.queryByLabelText(/QR code for share link/i)).not.toBeInTheDocument();
  });
});
